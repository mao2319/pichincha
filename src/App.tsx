import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AgentSidebar } from '@/components/AgentSidebar'
import { OnboardingForm } from '@/components/OnboardingForm'
import { RequestDetailsPanel } from '@/components/RequestDetailsPanel'
import { useAgentStore } from '@/stores/agentStore'
import { supabaseDb } from '@/services/supabase'

function App() {
  const { initializeAgents, setCurrentRequest } = useAgentStore()

  useEffect(() => {
    // Initialize agents on mount
    initializeAgents()

    // Subscribe to real-time updates
    const subscription = supabaseDb.subscribeToOnboardingRequests(
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          // Fetch and update current request if needed
          supabaseDb
            .getOnboardingRequest(payload.new.id)
            .then(setCurrentRequest)
            .catch(console.error)
        }
      }
    )

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [initializeAgents, setCurrentRequest])

  return (
    <div className="flex h-screen bg-gray-100">
      <AgentSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Pichincha AI Onboarding Platform
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Multi-agent orchestration system for intelligent client verification
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <OnboardingForm />
          </div>
          <div className="w-1/3 border-l border-gray-200">
            <RequestDetailsPanel />
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  )
}

export default App
