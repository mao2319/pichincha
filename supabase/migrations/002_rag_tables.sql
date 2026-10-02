-- Enable pgvector extension for RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- Create RAG documents table
CREATE TABLE IF NOT EXISTS public.rag_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector search
CREATE INDEX idx_rag_documents_embedding ON public.rag_documents
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for document_id and metadata
CREATE INDEX idx_rag_documents_id ON public.rag_documents(document_id);
CREATE INDEX idx_rag_documents_metadata ON public.rag_documents USING gin(metadata);

-- Create RAG vector search function
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

-- Create RLS policies for rag_documents
ALTER TABLE public.rag_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select on rag_documents" ON public.rag_documents
  FOR SELECT USING (true);

CREATE POLICY "Allow insert on rag_documents" ON public.rag_documents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on rag_documents" ON public.rag_documents
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete on rag_documents" ON public.rag_documents
  FOR DELETE USING (true);

-- Create table for cached RAG results
CREATE TABLE IF NOT EXISTS public.rag_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash VARCHAR(64) NOT NULL UNIQUE,
  query TEXT NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX idx_rag_cache_query_hash ON public.rag_cache(query_hash);
CREATE INDEX idx_rag_cache_expires_at ON public.rag_cache(expires_at);

-- Clean up expired cache entries (should be called periodically)
CREATE OR REPLACE FUNCTION public.cleanup_rag_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rag_cache
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
