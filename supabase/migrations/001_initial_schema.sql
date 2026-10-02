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

-- Create indices for better performance
CREATE INDEX idx_prospects_email ON public.prospects(email);
CREATE INDEX idx_prospects_document_number ON public.prospects(document_number);
CREATE INDEX idx_onboarding_requests_prospect_id ON public.onboarding_requests(prospect_id);
CREATE INDEX idx_onboarding_requests_status ON public.onboarding_requests(status);
CREATE INDEX idx_agent_traces_request_id ON public.agent_traces(request_id);
CREATE INDEX idx_agent_traces_agent_type ON public.agent_traces(agent_type);
CREATE INDEX idx_agent_traces_status ON public.agent_traces(status);

-- Create RLS policies
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_traces ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (can be restricted later)
CREATE POLICY "Allow insert on prospects" ON public.prospects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select on prospects" ON public.prospects
  FOR SELECT USING (true);

CREATE POLICY "Allow insert on onboarding_requests" ON public.onboarding_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select on onboarding_requests" ON public.onboarding_requests
  FOR SELECT USING (true);

CREATE POLICY "Allow update on onboarding_requests" ON public.onboarding_requests
  FOR UPDATE USING (true);

CREATE POLICY "Allow insert on agent_traces" ON public.agent_traces
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select on agent_traces" ON public.agent_traces
  FOR SELECT USING (true);

-- Create function to get statistics
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
