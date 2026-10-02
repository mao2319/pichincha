import { create } from 'zustand';
const DEFAULT_AGENTS = [
    {
        id: 'orchestrador',
        name: 'Agente Orquestador',
        type: 'orchestrador',
        description: 'Coordina el proceso de verificación general',
        status: 'idle',
        model: 'claude-opus-5-5',
        capabilities: ['orchestration', 'decision-making', 'delegation'],
    },
    {
        id: 'identidad',
        name: 'Agente Verifica Identidad',
        type: 'identidad',
        description: 'Verifica la identidad del prospecto',
        status: 'idle',
        model: 'claude-sonnet-5-5',
        capabilities: ['identity-verification', 'document-validation'],
    },
    {
        id: 'riesgo',
        name: 'Agente Listas de Riesgo',
        type: 'riesgo',
        description: 'Verifica listas de riesgo y sanciones',
        status: 'idle',
        model: 'claude-sonnet-5-5',
        capabilities: ['risk-assessment', 'compliance-check', 'aml-check'],
    },
    {
        id: 'documentacion',
        name: 'Agente Documentacion',
        type: 'documentacion',
        description: 'Verifica la documentación requerida',
        status: 'idle',
        model: 'claude-haiku-4-5-20251001',
        capabilities: ['document-verification', 'completeness-check'],
    },
    {
        id: 'respuesta',
        name: 'Agente Respuesta Cliente',
        type: 'respuesta',
        description: 'Genera respuestas profesionales al cliente',
        status: 'idle',
        model: 'claude-sonnet-5-5',
        capabilities: ['response-generation', 'communication'],
    },
];
export const useAgentStore = create((set, get) => ({
    agents: DEFAULT_AGENTS,
    currentRequest: null,
    traces: [],
    isProcessing: false,
    error: null,
    initializeAgents: () => {
        set({ agents: DEFAULT_AGENTS });
    },
    getAgent: (id) => {
        const { agents } = get();
        return agents.find((agent) => agent.id === id);
    },
    updateAgentStatus: (id, status) => {
        set((state) => ({
            agents: state.agents.map((agent) => agent.id === id ? { ...agent, status } : agent),
        }));
    },
    setCurrentRequest: (request) => {
        set({ currentRequest: request, traces: request.trace || [] });
    },
    updateRequestStatus: (status) => {
        set((state) => {
            if (!state.currentRequest)
                return state;
            return {
                currentRequest: { ...state.currentRequest, status },
            };
        });
    },
    addTrace: (trace) => {
        set((state) => ({
            traces: [...state.traces, trace],
        }));
    },
    updateTrace: (id, updates) => {
        set((state) => ({
            traces: state.traces.map((trace) => trace.agentId === id ? { ...trace, ...updates } : trace),
        }));
    },
    getTraces: () => {
        return get().traces;
    },
    setIsProcessing: (isProcessing) => {
        set({ isProcessing });
    },
    setError: (error) => {
        set({ error });
    },
}));
//# sourceMappingURL=agentStore.js.map