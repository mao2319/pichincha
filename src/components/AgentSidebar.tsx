import { useAgentStore } from '@/stores/agentStore'
import { CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react'

export function AgentSidebar() {
  const { agents } = useAgentStore()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing':
        return <Zap className="w-5 h-5 text-blue-500 animate-pulse" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50'
      case 'processing':
        return 'bg-blue-50'
      case 'failed':
        return 'bg-red-50'
      default:
        return 'bg-gray-50'
    }
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Available Agents
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Multi-agent orchestration system for onboarding verification
        </p>

        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`${getStatusBgColor(
                agent.status
              )} rounded-lg p-4 border border-gray-200 transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-3 mb-2">
                {getStatusIcon(agent.status)}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {agent.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    Status:
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      agent.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : agent.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : agent.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {agent.status.charAt(0).toUpperCase() +
                      agent.status.slice(1)}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-700">
                    Model:
                  </span>
                  <p className="text-xs text-gray-600 mt-1">{agent.model}</p>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-700">
                    Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="text-xs bg-white text-gray-700 px-2 py-1 rounded border border-gray-200"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Available Models Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Available Models</h3>
          <div className="space-y-2">
            {[
              { name: 'Claude Opus 5.5', desc: 'Most capable model' },
              { name: 'Claude Sonnet 5.5', desc: 'Balanced model' },
              { name: 'Claude Haiku 4.5', desc: 'Fast & efficient' },
            ].map((model) => (
              <div key={model.name} className="text-xs">
                <span className="font-medium text-gray-900">{model.name}</span>
                <p className="text-gray-600">{model.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MCP Servers Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">MCP Servers</h3>
          <div className="space-y-2">
            {[
              'OpenWebUI',
              'Browserbase',
              'GitHub Integration',
            ].map((mcp) => (
              <div
                key={mcp}
                className="flex items-center gap-2 text-xs text-gray-600 p-2 bg-gray-50 rounded"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {mcp}
              </div>
            ))}
          </div>
        </div>

        {/* RAG Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">RAG Integration</h3>
          <p className="text-xs text-gray-600 mb-3">
            Vector search enabled for context enrichment
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-gray-700">
              <span className="font-medium">Embedding Model:</span> Claude Embeddings
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Store:</span> Supabase pgvector
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
