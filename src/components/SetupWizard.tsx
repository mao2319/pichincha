import { useState } from 'react'
import { CheckCircle, Copy, ExternalLink, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface SetupWizardProps {
  onClose?: () => void
}

export function SetupWizard({ onClose }: SetupWizardProps) {
  const [step, setStep] = useState(1)
  const [copied, setCopied] = useState(false)

  const copySQL = (sql: string) => {
    navigator.clipboard.writeText(sql)
    setCopied(true)
    toast.success('SQL copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const migrationSQL = `-- ===== MIGRATION 001: INITIAL SCHEMA =====
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

CREATE TABLE IF NOT EXISTS public.onboarding_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE INDEX IF NOT EXISTS idx_prospects_email ON public.prospects(email);
CREATE INDEX IF NOT EXISTS idx_prospects_document_number ON public.prospects(document_number);
CREATE INDEX IF NOT EXISTS idx_onboarding_requests_prospect_id ON public.onboarding_requests(prospect_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_requests_status ON public.onboarding_requests(status);
CREATE INDEX IF NOT EXISTS idx_agent_traces_request_id ON public.agent_traces(request_id);
CREATE INDEX IF NOT EXISTS idx_agent_traces_agent_type ON public.agent_traces(agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_traces_status ON public.agent_traces(status);

ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_traces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert on prospects" ON public.prospects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on prospects" ON public.prospects FOR SELECT USING (true);
CREATE POLICY "Allow insert on onboarding_requests" ON public.onboarding_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on onboarding_requests" ON public.onboarding_requests FOR SELECT USING (true);
CREATE POLICY "Allow update on onboarding_requests" ON public.onboarding_requests FOR UPDATE USING (true);
CREATE POLICY "Allow insert on agent_traces" ON public.agent_traces FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select on agent_traces" ON public.agent_traces FOR SELECT USING (true);

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

-- ===== MIGRATION 002: RAG TABLES =====
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.rag_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rag_documents_embedding ON public.rag_documents
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_rag_documents_id ON public.rag_documents(document_id);
CREATE INDEX IF NOT EXISTS idx_rag_documents_metadata ON public.rag_documents USING gin(metadata);

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

ALTER TABLE public.rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on rag_documents" ON public.rag_documents FOR ALL USING (true);
CREATE POLICY "Allow all on rag_cache" ON public.rag_cache FOR ALL USING (true);`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              🚀 Database Setup Wizard
            </h2>
            {step === 3 && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close wizard"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Your app needs database tables to work. Follow these steps:
              </p>

              <ol className="space-y-3 ml-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span className="text-gray-700">
                    Go to{' '}
                    <a
                      href="https://supabase.com/dashboard/project/vhcapsgwemepzvlubtdy/sql/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"
                    >
                      Supabase SQL Editor
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span className="text-gray-700">
                    Click "New Query" button
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span className="text-gray-700">
                    Copy the SQL migration (see next step)
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span className="text-gray-700">
                    Paste it into the SQL Editor
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <span className="text-gray-700">
                    Click "Run" button
                  </span>
                </li>
              </ol>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Next: Copy SQL Migration →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-700 font-semibold mb-3">
                📋 Copy this SQL and run it in Supabase:
              </p>

              <div className="bg-gray-50 p-4 rounded border border-gray-200 h-64 overflow-y-auto">
                <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap break-words">
                  {migrationSQL}
                </pre>
              </div>

              <button
                onClick={() => copySQL(migrationSQL)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                {copied ? 'Copied to Clipboard! ✓' : 'Copy All SQL'}
              </button>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Next: Verify →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-gray-700 font-semibold mb-3">
                ✅ Database Setup Complete!
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-800">prospects table</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-800">onboarding_requests table</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-800">agent_traces table</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-800">rag_documents table (vector)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-800">rag_cache table</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded border border-blue-200 mt-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>Next:</strong> Refresh your browser and try
                  submitting the onboarding form!
                </p>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Refresh Page & Start Using App 🚀
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
