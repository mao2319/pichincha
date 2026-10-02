import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { mcpConfig } from '@/mcp/config';
import { ChevronRight, Network, BookOpen, CheckCircle, } from 'lucide-react';
export function Dashboard({ activeSection }) {
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
    ];
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
    ];
    const mcpServers = mcpConfig.getEnabledServers();
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
    };
    if (!activeSection) {
        return (_jsx("div", { className: "flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("h2", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Welcome to Pichincha AI" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Multi-agent orchestration platform for intelligent client onboarding" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [
                            { label: 'Models', value: '3', icon: '🤖' },
                            { label: 'Agents', value: '5', icon: '⚙️' },
                            { label: 'MCP Servers', value: '3', icon: '🔌' },
                            { label: 'RAG Documents', value: '55', icon: '📚' },
                        ].map((stat) => (_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500", children: [_jsx("div", { className: "text-2xl mb-2", children: stat.icon }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: stat.value }), _jsx("div", { className: "text-sm text-gray-600", children: stat.label })] }, stat.label))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "\uD83D\uDCDD Quick Start" }), _jsxs("ol", { className: "space-y-3 text-sm text-gray-700", children: [_jsx("li", { children: "1. Fill the onboarding form with prospect data" }), _jsx("li", { children: "2. Submit to trigger multi-agent verification" }), _jsx("li", { children: "3. Watch agents execute in real-time (left sidebar)" }), _jsx("li", { children: "4. View detailed results and traces (right panel)" })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "\uD83D\uDE80 Features" }), _jsxs("ul", { className: "space-y-2 text-sm text-gray-700", children: [_jsx("li", { children: "\u2713 Real-time agent orchestration" }), _jsx("li", { children: "\u2713 RAG-powered decision making" }), _jsx("li", { children: "\u2713 Live trace visualization" }), _jsx("li", { children: "\u2713 Multi-model support" })] })] })] })] }) }));
    }
    // Models Section
    if (activeSection === 'models') {
        return (_jsx("div", { className: "flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Available AI Models" }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: models.map((model) => (_jsxs("div", { className: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden", children: [_jsx("div", { className: "h-2 bg-gradient-to-r from-blue-500 to-blue-700" }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: model.name }), _jsx(CheckCircle, { className: "w-5 h-5 text-green-500" })] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: model.description }), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Max Input Tokens:" }), _jsx("span", { className: "font-semibold text-gray-900", children: model.tokens.input.toLocaleString() })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Max Output Tokens:" }), _jsx("span", { className: "font-semibold text-gray-900", children: model.tokens.output.toLocaleString() })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Cost per 1K tokens:" }), _jsxs("span", { className: "font-semibold text-gray-900", children: ["$", model.costPer1k] })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-gray-700 mb-2", children: "Use Cases:" }), _jsx("div", { className: "flex flex-wrap gap-1", children: model.use_cases.map((use) => (_jsx("span", { className: "text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded", children: use }, use))) })] })] })] }, model.id))) })] }) }));
    }
    // Agents Section
    if (activeSection === 'agents') {
        return (_jsx("div", { className: "flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Agent Network" }), _jsx("div", { className: "space-y-4", children: agents.map((agent) => (_jsxs("div", { className: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: agent.name }), _jsx("p", { className: "text-sm text-gray-600", children: agent.description })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500" }), _jsx("span", { className: "text-xs font-semibold text-green-700", children: "ACTIVE" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-600 font-semibold mb-1", children: "Model" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: agent.model })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-600 font-semibold mb-1", children: "Type" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: agent.type })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-600 font-semibold mb-1", children: "Tasks" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: agent.tasks })] })] })] }, agent.id))) })] }) }));
    }
    // MCP Section
    if (activeSection === 'mcp') {
        return (_jsx("div", { className: "flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-6", children: "MCP Servers Configuration" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: mcpServers.map((server) => (_jsxs("div", { className: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Network, { className: "w-6 h-6 text-blue-500" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: server.name }), _jsx("p", { className: "text-xs text-gray-600", children: server.type })] }), _jsxs("div", { className: "ml-auto flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), _jsx("span", { className: "text-xs font-semibold text-green-700", children: "Connected" })] })] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: server.description }), _jsxs("div", { className: "text-xs text-gray-600 bg-gray-50 p-3 rounded", children: [_jsx("p", { className: "font-semibold mb-2", children: "Configuration:" }), _jsx("pre", { className: "text-xs overflow-auto", children: JSON.stringify(server.config, null, 2) })] })] }, server.id))) })] }) }));
    }
    // RAG Section
    if (activeSection === 'rag') {
        return (_jsx("div", { className: "flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-6", children: "RAG Engine Configuration" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "lg:col-span-2 bg-white rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(BookOpen, { className: "w-6 h-6 text-blue-500" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "System Status" }), _jsx(CheckCircle, { className: "w-5 h-5 text-green-500 ml-auto" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between pb-4 border-b", children: [_jsx("span", { className: "text-gray-700", children: "Vector Store" }), _jsx("span", { className: "font-semibold text-gray-900", children: ragConfig.vectorStore })] }), _jsxs("div", { className: "flex items-center justify-between pb-4 border-b", children: [_jsx("span", { className: "text-gray-700", children: "Embedding Model" }), _jsx("span", { className: "font-semibold text-gray-900", children: ragConfig.embeddingModel })] }), _jsxs("div", { className: "flex items-center justify-between pb-4 border-b", children: [_jsx("span", { className: "text-gray-700", children: "Vector Dimension" }), _jsx("span", { className: "font-semibold text-gray-900", children: ragConfig.indexSize })] }), _jsxs("div", { className: "flex items-center justify-between pb-4 border-b", children: [_jsx("span", { className: "text-gray-700", children: "Similarity Threshold" }), _jsx("span", { className: "font-semibold text-gray-900", children: ragConfig.searchThreshold })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-700", children: "Caching" }), _jsxs("span", { className: "font-semibold text-green-700", children: ["Enabled (", ragConfig.cacheTTL, "h TTL)"] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Document Index" }), _jsxs("div", { className: "space-y-3", children: [ragConfig.documentTypes.map((doc) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-700 capitalize", children: doc.type }), _jsx("span", { className: "font-semibold text-blue-600", children: doc.count })] }, doc.type))), _jsxs("div", { className: "pt-3 border-t flex items-center justify-between font-semibold", children: [_jsx("span", { children: "Total Documents" }), _jsx("span", { className: "text-lg text-blue-600", children: ragConfig.documentTypes.reduce((sum, doc) => sum + doc.count, 0) })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Search Pipeline" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
                                    { step: 'Query', desc: 'User input or agent query' },
                                    { step: 'Embed', desc: 'Generate embeddings' },
                                    { step: 'Search', desc: 'Vector similarity search' },
                                    { step: 'Retrieve', desc: 'Return ranked results' },
                                ].map((item, idx) => (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mb-2", children: idx + 1 }), _jsx("p", { className: "font-semibold text-gray-900", children: item.step }), _jsx("p", { className: "text-xs text-gray-600 text-center mt-1", children: item.desc }), idx < 3 && (_jsx(ChevronRight, { className: "w-6 h-6 text-gray-400 mt-4" }))] }, item.step))) })] })] }) }));
    }
    return null;
}
//# sourceMappingURL=Dashboard.js.map