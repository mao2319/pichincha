import { Agent, OnboardingRequest, AgentTrace } from '@/types';
interface AgentStore {
    agents: Agent[];
    currentRequest: OnboardingRequest | null;
    traces: AgentTrace[];
    isProcessing: boolean;
    error: string | null;
    initializeAgents: () => void;
    getAgent: (id: string) => Agent | undefined;
    updateAgentStatus: (id: string, status: Agent['status']) => void;
    setCurrentRequest: (request: OnboardingRequest) => void;
    updateRequestStatus: (status: OnboardingRequest['status']) => void;
    addTrace: (trace: AgentTrace) => void;
    updateTrace: (id: string, updates: Partial<AgentTrace>) => void;
    getTraces: () => AgentTrace[];
    setIsProcessing: (isProcessing: boolean) => void;
    setError: (error: string | null) => void;
}
export declare const useAgentStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AgentStore>>;
export {};
//# sourceMappingURL=agentStore.d.ts.map