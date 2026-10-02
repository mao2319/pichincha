import { useAgentStore } from '@/stores/agentStore'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'

export function RequestDetailsPanel() {
  const { currentRequest, traces } = useAgentStore()

  if (!currentRequest) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">
            No request selected. Submit a form to get started.
          </p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'ambiguous':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentRequest.prospect.firstName}{' '}
                {currentRequest.prospect.lastName}
              </h1>
              <p className="text-gray-600 mt-2">
                Request ID: {currentRequest.id}
              </p>
            </div>
            <span
              className={`text-sm font-semibold px-4 py-2 rounded-full ${getStatusColor(
                currentRequest.status
              )}`}
            >
              {currentRequest.status.toUpperCase()}
            </span>
          </div>

          {/* Prospect Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentRequest.prospect.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentRequest.prospect.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Document</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentRequest.prospect.documentType}:{' '}
                {currentRequest.prospect.documentNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentRequest.prospect.city}, {currentRequest.prospect.country}
              </p>
            </div>
          </div>

          {/* Verification Result */}
          {currentRequest.result && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Verification Result
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Identity Verified</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentRequest.result.identityVerified ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentRequest.result.riskLevel.toUpperCase()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Documentation</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentRequest.result.documentationStatus.toUpperCase()}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Recommended Action</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentRequest.result.recommendedAction}
                  </p>
                </div>
              </div>

              {currentRequest.result.riskFactors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Risk Factors:
                  </p>
                  <ul className="space-y-1">
                    {currentRequest.result.riskFactors.map((factor, idx) => (
                      <li key={idx} className="text-sm text-red-600">
                        • {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Agent Traces */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Agent Execution Trace
            </h2>
            <div className="space-y-4">
              {traces.length === 0 ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p>Waiting for agent execution...</p>
                </div>
              ) : (
                traces.map((trace, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {trace.agentName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {trace.agentType}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          trace.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : trace.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : trace.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {trace.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        Model: <span className="font-medium">{trace.model}</span>
                      </p>
                      <p>
                        Start:{' '}
                        <span className="font-medium">
                          {format(
                            new Date(trace.startTime),
                            'HH:mm:ss'
                          )}
                        </span>
                      </p>
                      {trace.endTime && (
                        <p>
                          End:{' '}
                          <span className="font-medium">
                            {format(
                              new Date(trace.endTime),
                              'HH:mm:ss'
                            )}
                          </span>
                        </p>
                      )}
                    </div>

                    {trace.error && (
                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-xs text-red-800">{trace.error}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
