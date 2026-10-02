# Supabase Database Schema Review

**Project**: vhcapsgwemepzvlubtdy  
**Region**: us-east-1  
**Status**: ⏳ **PENDING MIGRATION**

---

## 📋 Required Database Objects

### Tables to Create (5 Total)

#### 1. ✅ **prospects** Table
**Purpose**: Store client demographic and document information

```sql
CREATE TABLE public.prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  document_type VARCHAR(50),  -- passport, national_id, driver_license
  document_number VARCHAR(100) NOT NULL UNIQUE,
  date_of_birth DATE,
  address VARCHAR(500),
  city VARCHAR(100),
  country VARCHAR(100),
  occupation VARCHAR(255),
  monthly_income DECIMAL(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indices**:
- `idx_prospects_email` - Fast email lookup
- `idx_prospects_document_number` - Unique document search

**Use Cases**:
- Quick client lookup by email
- Verify document uniqueness
- Income analysis
- Demographics reporting

---

#### 2. ✅ **onboarding_requests** Table
**Purpose**: Track onboarding verification workflow

```sql
CREATE TABLE public.onboarding_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  -- pending, in_progress, approved, rejected, ambiguous
  result JSONB,  -- Stores VerificationResult
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indices**:
- `idx_onboarding_requests_prospect_id` - Lookup by prospect
- `idx_onboarding_requests_status` - Filter by status

**Data Example**:
```json
{
  "status": "approved",
  "result": {
    "identityVerified": true,
    "riskLevel": "low",
    "documentationStatus": "complete",
    "recommendedAction": "Proceed with approval"
  }
}
```

**Use Cases**:
- Track verification status
- Generate statistics
- Report on approval rates
- Audit trail

---

#### 3. ✅ **agent_traces** Table
**Purpose**: Log every agent execution for debugging and monitoring

```sql
CREATE TABLE public.agent_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.onboarding_requests(id) ON DELETE CASCADE,
  agent_id VARCHAR(100) NOT NULL,  -- orchestrador, identidad, riesgo, etc
  agent_name VARCHAR(255) NOT NULL,
  agent_type VARCHAR(50) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  input JSONB,    -- Agent input data
  output JSONB,   -- Agent output/result
  error TEXT,     -- Error message if failed
  model VARCHAR(100),  -- claude-opus-5-5, claude-sonnet-5-5, etc
  token_usage JSONB,   -- {input: 1250, output: 456}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indices**:
- `idx_agent_traces_request_id` - Query by request
- `idx_agent_traces_agent_type` - Filter by agent type
- `idx_agent_traces_status` - Find failed agents

**Data Example**:
```json
{
  "agent_id": "identidad",
  "agent_name": "Agente Verifica Identidad",
  "status": "completed",
  "model": "claude-sonnet-5-5",
  "input": {"document_id": "1712345678"},
  "output": {"verified": true, "confidence": 0.95},
  "token_usage": {"input": 250, "output": 150}
}
```

**Use Cases**:
- Debug agent execution
- Monitor performance
- Track token usage
- Performance analytics
- Cost tracking

---

#### 4. ✅ **rag_documents** Table
**Purpose**: Store documents with vector embeddings for RAG

```sql
CREATE TABLE public.rag_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  embedding vector(1536),  -- Claude embeddings (1536 dimensions)
  metadata JSONB DEFAULT '{}',
  -- metadata: {type: 'policy', indexed_at: '...', source: '...'}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indices**:
- `idx_rag_documents_embedding` - IVFFlat vector index (lists=100)
- `idx_rag_documents_id` - Document lookup
- `idx_rag_documents_metadata` - GIN index for JSONB

**Vector Configuration**:
- **Model**: Claude embeddings
- **Dimension**: 1536
- **Similarity Metric**: Cosine distance
- **Index Type**: IVFFlat (Approximate Nearest Neighbor)
- **Lists**: 100 (balance between speed and accuracy)

**Data Example**:
```json
{
  "document_id": "policy_001",
  "content": "Client verification policy for high-risk individuals...",
  "embedding": [0.123, -0.456, 0.789, ...],  // 1536 floats
  "metadata": {
    "type": "policy",
    "source": "compliance",
    "indexed_at": "2026-10-02"
  }
}
```

**Use Cases**:
- Semantic search of policies
- Context enrichment for agents
- Knowledge base retrieval
- Decision support

---

#### 5. ✅ **rag_cache** Table
**Purpose**: Cache RAG search results for performance

```sql
CREATE TABLE public.rag_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash VARCHAR(64) NOT NULL UNIQUE,  -- SHA256 of query
  query TEXT NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);
```

**Indices**:
- `idx_rag_cache_query_hash` - Fast lookup by query hash
- `idx_rag_cache_expires_at` - Find expired entries

**Use Cases**:
- Reduce redundant searches
- Improve performance
- Reduce API costs
- Historical query tracking

---

## 🔧 Required Functions (3 Total)

### 1. ✅ **get_statistics()** Function
**Purpose**: Get dashboard statistics

```sql
CREATE OR REPLACE FUNCTION public.get_statistics()
RETURNS TABLE(
  total_requests BIGINT,
  approved_requests BIGINT,
  rejected_requests BIGINT,
  ambiguous_requests BIGINT,
  average_processing_time NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_requests,
    COUNT(CASE WHEN or.status = 'approved' THEN 1 END),
    COUNT(CASE WHEN or.status = 'rejected' THEN 1 END),
    COUNT(CASE WHEN or.status = 'ambiguous' THEN 1 END),
    AVG(EXTRACT(EPOCH FROM (or.updated_at - or.created_at)))
  FROM public.onboarding_requests or;
END;
$$ LANGUAGE plpgsql;
```

**Used By**: Dashboard statistics panel

---

### 2. ✅ **search_documents()** Function
**Purpose**: Vector similarity search for RAG

```sql
CREATE OR REPLACE FUNCTION public.search_documents(
  query_embedding vector,
  similarity_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE(
  id uuid,
  document_id varchar,
  content text,
  metadata jsonb,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    rd.id,
    rd.document_id,
    rd.content,
    rd.metadata,
    (1 - (rd.embedding <=> query_embedding))::float as similarity
  FROM public.rag_documents rd
  WHERE (1 - (rd.embedding <=> query_embedding)) > similarity_threshold
  ORDER BY rd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;
```

**Used By**: RAG retrieval service, agent context enrichment

**Parameters**:
- `query_embedding` - Embedded query (1536 dimensions)
- `similarity_threshold` - Minimum similarity (0-1, default 0.7)
- `match_count` - Max results (default 5)

---

### 3. ✅ **cleanup_rag_cache()** Function
**Purpose**: Remove expired cache entries

```sql
CREATE OR REPLACE FUNCTION public.cleanup_rag_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rag_cache
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
```

**Used By**: Scheduled maintenance job

---

## 🔐 Row-Level Security Policies

All tables have RLS enabled with these policies:

### Prospects RLS
- ✅ `Allow insert on prospects` - Anyone can submit
- ✅ `Allow select on prospects` - Anyone can read

### Onboarding Requests RLS
- ✅ `Allow insert` - Create new requests
- ✅ `Allow select` - Read requests
- ✅ `Allow update` - Update status

### Agent Traces RLS
- ✅ `Allow select` - Read traces
- ✅ `Allow insert` - Log executions

### RAG Documents RLS
- ✅ `Allow all` - Full CRUD for admin

### RAG Cache RLS
- ✅ `Allow all` - Cache management

---

## 📊 Database Relationships

```
prospects (1) ──► (N) onboarding_requests
    ↓
    └──► (N) agent_traces
         └──► ⌛ captured in execution log
```

**Cascade Delete**: If prospect is deleted, all related requests and traces are deleted.

---

## 🚀 Extensions Required

- ✅ **pgvector** - For vector similarity search
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;
  ```

---

## 📈 Current Status

### ✅ Defined in SQL Migrations
- [x] 5 tables designed
- [x] 7 indices created
- [x] 3 functions ready
- [x] RLS policies configured
- [x] Cascade deletes set up

### ⏳ Needs to be Applied
- [ ] Run `001_initial_schema.sql` in Supabase SQL Editor
- [ ] Run `002_rag_tables.sql` in Supabase SQL Editor
- [ ] Verify pgvector extension is enabled
- [ ] Verify all tables and functions exist

### ❌ Currently Missing
- No tables exist in database (migration not applied)
- No functions deployed
- No RLS policies active
- No vector search capability

---

## ✅ Verification Checklist

After applying migrations, verify:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Expected: agent_traces, onboarding_requests, prospects, rag_cache, rag_documents

-- Check functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;

-- Expected: cleanup_rag_cache, get_statistics, search_documents

-- Check pgvector extension
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Expected: vector extension should be listed

-- Check indices
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY indexname;

-- Expected: 10+ indices for performance
```

---

## 📝 Connection String

```
postgresql://[user]:[password]@db.vhcapsgwemepzvlubtdy.supabase.co:5432/postgres
```

**Region**: us-east-1 (Washington, D.C.)

---

## 🎯 Next Steps

1. **Apply Migration 001**: Creates all tables and indices
2. **Apply Migration 002**: Creates RAG tables with pgvector
3. **Verify**: Run SQL verification queries
4. **Test**: Submit onboarding form and check database

Once migrations are applied:
- ✅ Network errors will resolve
- ✅ Data will persist
- ✅ Real-time subscriptions work
- ✅ Ready for production

---

**Status**: 🔴 **AWAITING MIGRATION**  
**Action Required**: Apply SQL to Supabase  
**Expected Duration**: < 5 minutes
