import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/Header'
import { Dashboard } from '@/components/Dashboard'
import { SetupWizard } from '@/components/SetupWizard'
import { AgentSidebar } from '@/components/AgentSidebar'
import { OnboardingForm } from '@/components/OnboardingForm'
import { RequestDetailsPanel } from '@/components/RequestDetailsPanel'
import { useAgentStore } from '@/stores/agentStore'
import { supabaseDb } from '@/services/supabase'

function App() {
  const [activeSection] = useState<string | null>(null)
  const [showSetup, setShowSetup] = useState(false)
  const { initializeAgents, setCurrentRequest } = useAgentStore()

  useEffect(() => {
    // Initialize agents on mount
    initializeAgents()

    // Subscribe to real-time updates
    const subscription = supabaseDb.subscribeToOnboardingRequests(
      (payload: any) => {
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

  const isViewingDashboard = activeSection !== null

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {showSetup && <SetupWizard onClose={() => setShowSetup(false)} />}

      <Header />

      {isViewingDashboard ? (
        // Dashboard View
        <Dashboard activeSection={activeSection} />
      ) : (
        // Main App View
        <div className="flex flex-1 overflow-hidden">
          <AgentSidebar />

          <div className="flex-1 flex flex-col">
            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <OnboardingForm />
              </div>
              <div className="w-96 border-l border-gray-200 bg-white">
                <RequestDetailsPanel />
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  )
}

export default App
