// Agent Types
export type AgentType = 'orchestrador' | 'identidad' | 'riesgo' | 'documentacion' | 'respuesta'

export interface Agent {
  id: string
  name: string
  type: AgentType
  description: string
  status: 'idle' | 'processing' | 'completed' | 'failed'
  model: string
  capabilities: string[]
}

// Request Types
export interface ProspectData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  documentType: string
  documentNumber: string
  dateOfBirth: string
  address: string
  city: string
  country: string
  occupation: string
  monthlyIncome: number
  createdAt: string
}

export interface OnboardingRequest {
  id: string
  prospectId: string
  prospect: ProspectData
  status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'ambiguous'
  createdAt: string
  updatedAt: string
  assignedAgent?: string
  result?: VerificationResult
  trace: AgentTrace[]
}

// Verification Result Types
export interface VerificationResult {
  identityVerified: boolean
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  documentationStatus: 'complete' | 'incomplete' | 'pending'
  overallStatus: 'approved' | 'rejected' | 'ambiguous'
  recommendedAction: string
  riskFactors: string[]
  missingDocuments?: string[]
}

// Agent Trace
export interface AgentTrace {
  agentId: string
  agentName: string
  agentType: AgentType
  startTime: string
  endTime?: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  input: Record<string, unknown>
  output: Record<string, unknown>
  error?: string
  model: string
  tokenUsage?: {
    input: number
    output: number
  }
}

// Model Configuration
export interface ModelConfig {
  id: string
  name: string
  provider: 'anthropic'
  contextWindow: number
  maxOutputTokens: number
  costPer1kInputTokens: number
  costPer1kOutputTokens: number
}

// MCP Configuration
export interface MCPConfig {
  id: string
  name: string
  description: string
  type: string
  enabled: boolean
  config: Record<string, unknown>
}

// RAG Configuration
export interface RAGConfig {
  id: string
  name: string
  type: 'vector' | 'bm25' | 'hybrid'
  enabled: boolean
  vectorStoreId?: string
  embeddingModel?: string
}

// OAuth Types
export interface OAuth2Config {
  clientId: string
  clientSecret?: string
  redirectUri: string
  scopes: string[]
  provider: string
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'analyst' | 'reviewer'
  createdAt: string
  lastLogin?: string
}

// Statistics Types
export interface Statistics {
  totalRequests: number
  approvedRequests: number
  rejectedRequests: number
  ambiguousRequests: number
  averageProcessingTime: number
  successRate: number
  topRiskFactors: { factor: string; count: number }[]
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
