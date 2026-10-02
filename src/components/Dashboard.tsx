import { mcpConfig } from '@/mcp/config'
import {
  ChevronRight,
  Network,
  BookOpen,
  CheckCircle,
} from 'lucide-react'

interface DashboardProps {
  activeSection: string | null
}

export function Dashboard({ activeSection }: DashboardProps) {

  const models = [
    {
      id: 'claude-opus-5-5',
      name: 'Claude Opus 5.5',
      description: 'Most capable model for complex reasoning',
      tokens: { input: 200, output: 4000 },
      costPer1k: 3,
      use_cases: ['Orchestration', 'Complex Analysis', 'Decision Making'],
      status: 'active',
    },
    {
      id: 'claude-sonnet-5-5',
      name: 'Claude Sonnet 5.5',
      description: 'Balanced intelligence and speed',
      tokens: { input: 1000, output: 4000 },
      costPer1k: 1,
      use_cases: ['Verification', 'Risk Assessment', 'Analysis'],
      status: 'active',
    },
    {
      id: 'claude-haiku-4-5',
      name: 'Claude Haiku 4.5',
      description: 'Fast and efficient for simple tasks',
      tokens: { input: 8000, output: 24000 },
      costPer1k: 0.08,
      use_cases: ['Documentation Check', 'Quick Validation'],
      status: 'active',
    },
  ]

  const agents = [
    {
      id: 'orchestrador',
      name: 'Agente Orquestador',
      type: 'orchestrador',
      model: 'claude-opus-5-5',
      status: 'active',
      description: 'Coordinates verification process',
      tasks: 'Planning, Orchestration, Decision Making',
    },
    {
      id: 'identidad',
      name: 'Agente Verifica Identidad',
      type: 'identidad',
      model: 'claude-sonnet-5-5',
      status: 'active',
      description: 'Identity verification',
      tasks: 'Document Validation, Age Verification',
    },
    {
      id: 'riesgo',
      name: 'Agente Listas de Riesgo',
      type: 'riesgo',
      model: 'claude-sonnet-5-5',
      status: 'active',
      description: 'Risk assessment and compliance',
      tasks: 'PEP Check, OFAC, AML Assessment',
    },
    {
      id: 'documentacion',
      name: 'Agente Documentacion',
      type: 'documentacion',
      model: 'claude-haiku-4-5-20251001',
      status: 'active',
      description: 'Documentation verification',
      tasks: 'Completeness Check, Quality Validation',
    },
    {
      id: 'respuesta',
      name: 'Agente Respuesta Cliente',
      type: 'respuesta',
      model: 'claude-sonnet-5-5',
      status: 'active',
      description: 'Client communication',
      tasks: 'Response Generation, Translation',
    },
  ]

  const mcpServers = mcpConfig.getEnabledServers()

  const ragConfig = {
    enabled: true,
    embeddingModel: 'Claude Embeddings',
    vectorStore: 'Supabase pgvector',
    indexSize: 1536,
    documentTypes: [
      { type: 'policy', count: 15 },
      { type: 'procedure', count: 8 },
      { type: 'guideline', count: 12 },
      { type: 'risk_assessment', count: 20 },
    ],
    searchThreshold: 0.7,
    cacheEnabled: true,
    cacheTTL: 24,
  }

  if (!activeSection) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Pichincha AI
          </h2>
          <p className="text-gray-600 mb-8">
            Multi-agent orchestration platform for intelligent client onboarding
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Models', value: '3', icon: '🤖' },
              { label: 'Agents', value: '5', icon: '⚙️' },
              { label: 'MCP Servers', value: '3', icon: '🔌' },
              { label: 'RAG Documents', value: '55', icon: '📚' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Getting Started */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📝 Quick Start
              </h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li>1. Fill the onboarding form with prospect data</li>
                <li>2. Submit to trigger multi-agent verification</li>
                <li>3. Watch agents execute in real-time (left sidebar)</li>
                <li>4. View detailed results and traces (right panel)</li>
              </ol>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🚀 Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Real-time agent orchestration</li>
                <li>✓ RAG-powered decision making</li>
                <li>✓ Live trace visualization</li>
                <li>✓ Multi-model support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Models Section
  if (activeSection === 'models') {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Available AI Models
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <div
                key={model.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {model.name}
                    </h3>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {model.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Input Tokens:</span>
                      <span className="font-semibold text-gray-900">
                        {model.tokens.input.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Output Tokens:</span>
                      <span className="font-semibold text-gray-900">
                        {model.tokens.output.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cost per 1K tokens:</span>
                      <span className="font-semibold text-gray-900">
                        ${model.costPer1k}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Use Cases:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {model.use_cases.map((use) => (
                        <span
                          key={use}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Agents Section
  if (activeSection === 'agents') {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Agent Network
          </h2>

          <div className="space-y-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gray-600">{agent.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-xs font-semibold text-green-700">
                      ACTIVE
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      Model
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {agent.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      Type
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {agent.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      Tasks
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {agent.tasks}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // MCP Section
  if (activeSection === 'mcp') {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            MCP Servers Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mcpServers.map((server) => (
              <div
                key={server.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Network className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {server.name}
                    </h3>
                    <p className="text-xs text-gray-600">{server.type}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-green-700">
                      Connected
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {server.description}
                </p>

                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-2">Configuration:</p>
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(server.config, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // RAG Section
  if (activeSection === 'rag') {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            RAG Engine Configuration
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* RAG Status */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  System Status
                </h3>
                <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-700">Vector Store</span>
                  <span className="font-semibold text-gray-900">
                    {ragConfig.vectorStore}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-700">Embedding Model</span>
                  <span className="font-semibold text-gray-900">
                    {ragConfig.embeddingModel}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-700">Vector Dimension</span>
                  <span className="font-semibold text-gray-900">
                    {ragConfig.indexSize}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <span className="text-gray-700">Similarity Threshold</span>
                  <span className="font-semibold text-gray-900">
                    {ragConfig.searchThreshold}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Caching</span>
                  <span className="font-semibold text-green-700">
                    Enabled ({ragConfig.cacheTTL}h TTL)
                  </span>
                </div>
              </div>
            </div>

            {/* Document Types */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Document Index
              </h3>
              <div className="space-y-3">
                {ragConfig.documentTypes.map((doc) => (
                  <div key={doc.type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {doc.type}
                    </span>
                    <span className="font-semibold text-blue-600">
                      {doc.count}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t flex items-center justify-between font-semibold">
                  <span>Total Documents</span>
                  <span className="text-lg text-blue-600">
                    {ragConfig.documentTypes.reduce((sum, doc) => sum + doc.count, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Pipeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Search Pipeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: 'Query', desc: 'User input or agent query' },
                { step: 'Embed', desc: 'Generate embeddings' },
                { step: 'Search', desc: 'Vector similarity search' },
                { step: 'Retrieve', desc: 'Return ranked results' },
              ].map((item, idx) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mb-2">
                    {idx + 1}
                  </div>
                  <p className="font-semibold text-gray-900">{item.step}</p>
                  <p className="text-xs text-gray-600 text-center mt-1">
                    {item.desc}
                  </p>
                  {idx < 3 && (
                    <ChevronRight className="w-6 h-6 text-gray-400 mt-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
