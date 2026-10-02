import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { SetupWizard } from '@/components/SetupWizard';
import { AgentSidebar } from '@/components/AgentSidebar';
import { OnboardingForm } from '@/components/OnboardingForm';
import { RequestDetailsPanel } from '@/components/RequestDetailsPanel';
import { useAgentStore } from '@/stores/agentStore';
import { supabaseDb } from '@/services/supabase';
function App() {
    const [activeSection] = useState(null);
    const [showSetup, setShowSetup] = useState(false);
    const { initializeAgents, setCurrentRequest } = useAgentStore();
    useEffect(() => {
        // Initialize agents on mount
        initializeAgents();
        // Subscribe to real-time updates
        const subscription = supabaseDb.subscribeToOnboardingRequests((payload) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                // Fetch and update current request if needed
                supabaseDb
                    .getOnboardingRequest(payload.new.id)
                    .then(setCurrentRequest)
                    .catch(console.error);
            }
        });
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [initializeAgents, setCurrentRequest]);
    const isViewingDashboard = activeSection !== null;
    return (_jsxs("div", { className: "flex flex-col h-screen bg-gray-50", children: [showSetup && _jsx(SetupWizard, { onClose: () => setShowSetup(false) }), _jsx(Header, {}), isViewingDashboard ? (
            // Dashboard View
            _jsx(Dashboard, { activeSection: activeSection })) : (
            // Main App View
            _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsx(AgentSidebar, {}), _jsx("div", { className: "flex-1 flex flex-col", children: _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(OnboardingForm, {}) }), _jsx("div", { className: "w-96 border-l border-gray-200 bg-white", children: _jsx(RequestDetailsPanel, {}) })] }) })] })), _jsx(Toaster, { position: "top-right" })] }));
}
export default App;
//# sourceMappingURL=App.js.map