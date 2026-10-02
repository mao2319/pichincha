import { supabase } from './supabase'

/**
 * Complete database migration system
 * Applies all schema changes to Supabase
 */

export const migrationService = {
  // Apply all migrations
  async applyAllMigrations(): Promise<{
    success: boolean
    migrations: { name: string; status: string; error?: string }[]
  }> {
    const results = []

    // Migration 1: Initial Schema
    const m1 = await this.applyInitialSchema()
    results.push({
      name: '001_initial_schema',
      status: m1.success ? 'success' : 'failed',
      error: m1.error,
    })

    // Migration 2: RAG Tables
    const m2 = await this.applyRAGTables()
    results.push({
      name: '002_rag_tables',
      status: m2.success ? 'success' : 'failed',
      error: m2.error,
    })

    return {
      success: m1.success && m2.success,
      migrations: results,
    }
  },

  // Migration 1: Initial Schema
  async applyInitialSchema(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          -- Create prospects table
          CREATE TABLE IF NOT EXISTS public.prospects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255),
            email VARCHAR(255) NOT NULL UNIQUE,
            phone VARCHAR(20),
            document_type VARCHAR(50),
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

          -- Create onboarding_requests table
          CREATE TABLE IF NOT EXISTS public.onboarding_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            result JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Create agent_traces table
          CREATE TABLE IF NOT EXISTS public.agent_traces (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            request_id UUID NOT NULL REFERENCES public.onboarding_requests(id) ON DELETE CASCADE,
            agent_id VARCHAR(100) NOT NULL,
            agent_name VARCHAR(255) NOT NULL,
            agent_type VARCHAR(50) NOT NULL,
            start_time TIMESTAMP WITH TIME ZONE NOT NULL,
            end_time TIMESTAMP WITH TIME ZONE,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            input JSONB,
            output JSONB,
            error TEXT,
            model VARCHAR(100),
            token_usage JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Create indices
          CREATE INDEX IF NOT EXISTS idx_prospects_email ON public.prospects(email);
          CREATE INDEX IF NOT EXISTS idx_prospects_document_number ON public.prospects(document_number);
          CREATE INDEX IF NOT EXISTS idx_onboarding_requests_prospect_id ON public.onboarding_requests(prospect_id);
          CREATE INDEX IF NOT EXISTS idx_onboarding_requests_status ON public.onboarding_requests(status);
          CREATE INDEX IF NOT EXISTS idx_agent_traces_request_id ON public.agent_traces(request_id);
          CREATE INDEX IF NOT EXISTS idx_agent_traces_agent_type ON public.agent_traces(agent_type);
          CREATE INDEX IF NOT EXISTS idx_agent_traces_status ON public.agent_traces(status);

          -- Enable RLS
          ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
          ALTER TABLE public.onboarding_requests ENABLE ROW LEVEL SECURITY;
          ALTER TABLE public.agent_traces ENABLE ROW LEVEL SECURITY;

          -- Create policies
          CREATE POLICY "Allow insert on prospects" ON public.prospects FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow select on prospects" ON public.prospects FOR SELECT USING (true);
          CREATE POLICY "Allow insert on onboarding_requests" ON public.onboarding_requests FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow select on onboarding_requests" ON public.onboarding_requests FOR SELECT USING (true);
          CREATE POLICY "Allow update on onboarding_requests" ON public.onboarding_requests FOR UPDATE USING (true);
          CREATE POLICY "Allow insert on agent_traces" ON public.agent_traces FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow select on agent_traces" ON public.agent_traces FOR SELECT USING (true);

          -- Create function
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
              COUNT(CASE WHEN or.status = 'approved' THEN 1 END) as approved_requests,
              COUNT(CASE WHEN or.status = 'rejected' THEN 1 END) as rejected_requests,
              COUNT(CASE WHEN or.status = 'ambiguous' THEN 1 END) as ambiguous_requests,
              AVG(EXTRACT(EPOCH FROM (or.updated_at - or.created_at))) as average_processing_time
            FROM public.onboarding_requests or;
          END;
          $$ LANGUAGE plpgsql;
        `,
      })

      if (error) throw new Error(error.message)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  // Migration 2: RAG Tables
  async applyRAGTables(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          -- Enable pgvector
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

          -- Create vector index
          CREATE INDEX IF NOT EXISTS idx_rag_documents_embedding ON public.rag_documents
          USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

          -- Create other indices
          CREATE INDEX IF NOT EXISTS idx_rag_documents_id ON public.rag_documents(document_id);
          CREATE INDEX IF NOT EXISTS idx_rag_documents_metadata ON public.rag_documents USING gin(metadata);

          -- Create RAG cache table
          CREATE TABLE IF NOT EXISTS public.rag_cache (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            query_hash VARCHAR(64) NOT NULL UNIQUE,
            query TEXT NOT NULL,
            results JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
          );

          CREATE INDEX IF NOT EXISTS idx_rag_cache_query_hash ON public.rag_cache(query_hash);
          CREATE INDEX IF NOT EXISTS idx_rag_cache_expires_at ON public.rag_cache(expires_at);

          -- Create search function
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

          -- Create cleanup function
          CREATE OR REPLACE FUNCTION public.cleanup_rag_cache()
          RETURNS void AS $$
          BEGIN
            DELETE FROM public.rag_cache
            WHERE expires_at < NOW();
          END;
          $$ LANGUAGE plpgsql;

          -- Enable RLS
          ALTER TABLE public.rag_documents ENABLE ROW LEVEL SECURITY;
          ALTER TABLE public.rag_cache ENABLE ROW LEVEL SECURITY;

          -- Create policies
          CREATE POLICY "Allow select on rag_documents" ON public.rag_documents FOR SELECT USING (true);
          CREATE POLICY "Allow insert on rag_documents" ON public.rag_documents FOR INSERT WITH CHECK (true);
          CREATE POLICY "Allow update on rag_documents" ON public.rag_documents FOR UPDATE USING (true);
          CREATE POLICY "Allow delete on rag_documents" ON public.rag_documents FOR DELETE USING (true);
          CREATE POLICY "Allow select on rag_cache" ON public.rag_cache FOR SELECT USING (true);
          CREATE POLICY "Allow insert on rag_cache" ON public.rag_cache FOR INSERT WITH CHECK (true);
        `,
      })

      if (error) throw new Error(error.message)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  // Verify all tables exist
  async verifyMigrations(): Promise<{
    success: boolean
    tables: string[]
    missing: string[]
  }> {
    try {
      const { data, error } = await supabase.rpc('get_table_names')

      if (error) throw new Error(error.message)

      const requiredTables = [
        'prospects',
        'onboarding_requests',
        'agent_traces',
        'rag_documents',
        'rag_cache',
      ]

      const tables = (data || []).map((t: any) => t.tablename)
      const missing = requiredTables.filter((t) => !tables.includes(t))

      return {
        success: missing.length === 0,
        tables,
        missing,
      }
    } catch (error) {
      return {
        success: false,
        tables: [],
        missing: ['Unable to verify - check Supabase connection'],
      }
    }
  },

  // Reset all tables (careful - destructive!)
  async resetDatabase(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          DROP TABLE IF EXISTS public.rag_cache CASCADE;
          DROP TABLE IF EXISTS public.rag_documents CASCADE;
          DROP TABLE IF EXISTS public.agent_traces CASCADE;
          DROP TABLE IF EXISTS public.onboarding_requests CASCADE;
          DROP TABLE IF EXISTS public.prospects CASCADE;
          DROP FUNCTION IF EXISTS public.get_statistics() CASCADE;
          DROP FUNCTION IF EXISTS public.search_documents(vector, float, int) CASCADE;
          DROP FUNCTION IF EXISTS public.cleanup_rag_cache() CASCADE;
        `,
      })

      if (error) throw new Error(error.message)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },
}
