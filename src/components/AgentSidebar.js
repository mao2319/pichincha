import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAgentStore } from '@/stores/agentStore';
import { CheckCircle, Clock, AlertCircle, Zap } from 'lucide-react';
export function AgentSidebar() {
    const { agents } = useAgentStore();
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return _jsx(CheckCircle, { className: "w-5 h-5 text-green-500" });
            case 'processing':
                return _jsx(Zap, { className: "w-5 h-5 text-blue-500 animate-pulse" });
            case 'failed':
                return _jsx(AlertCircle, { className: "w-5 h-5 text-red-500" });
            default:
                return _jsx(Clock, { className: "w-5 h-5 text-gray-400" });
        }
    };
    const getStatusBgColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-50';
            case 'processing':
                return 'bg-blue-50';
            case 'failed':
                return 'bg-red-50';
            default:
                return 'bg-gray-50';
        }
    };
    return (_jsx("div", { className: "w-80 bg-white border-r border-gray-200 overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Available Agents" }), _jsx("p", { className: "text-sm text-gray-600 mb-6", children: "Multi-agent orchestration system for onboarding verification" }), _jsx("div", { className: "space-y-3", children: agents.map((agent) => (_jsxs("div", { className: `${getStatusBgColor(agent.status)} rounded-lg p-4 border border-gray-200 transition-all hover:shadow-md`, children: [_jsxs("div", { className: "flex items-start gap-3 mb-2", children: [getStatusIcon(agent.status), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 text-sm", children: agent.name }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: agent.description })] })] }), _jsxs("div", { className: "mt-3 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-medium text-gray-700", children: "Status:" }), _jsx("span", { className: `text-xs font-semibold px-2 py-1 rounded ${agent.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : agent.status === 'processing'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : agent.status === 'failed'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'}`, children: agent.status.charAt(0).toUpperCase() +
                                                    agent.status.slice(1) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-medium text-gray-700", children: "Model:" }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: agent.model })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-medium text-gray-700", children: "Capabilities:" }), _jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: agent.capabilities.map((cap) => (_jsx("span", { className: "text-xs bg-white text-gray-700 px-2 py-1 rounded border border-gray-200", children: cap }, cap))) })] })] })] }, agent.id))) }), _jsxs("div", { className: "mt-8 pt-6 border-t border-gray-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "Available Models" }), _jsx("div", { className: "space-y-2", children: [
                                { name: 'Claude Opus 5.5', desc: 'Most capable model' },
                                { name: 'Claude Sonnet 5.5', desc: 'Balanced model' },
                                { name: 'Claude Haiku 4.5', desc: 'Fast & efficient' },
                            ].map((model) => (_jsxs("div", { className: "text-xs", children: [_jsx("span", { className: "font-medium text-gray-900", children: model.name }), _jsx("p", { className: "text-gray-600", children: model.desc })] }, model.name))) })] }), _jsxs("div", { className: "mt-6 pt-6 border-t border-gray-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "MCP Servers" }), _jsx("div", { className: "space-y-2", children: [
                                'OpenWebUI',
                                'Browserbase',
                                'GitHub Integration',
                            ].map((mcp) => (_jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-600 p-2 bg-gray-50 rounded", children: [_jsx("span", { className: "w-2 h-2 bg-green-500 rounded-full" }), mcp] }, mcp))) })] }), _jsxs("div", { className: "mt-6 pt-6 border-t border-gray-200", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "RAG Integration" }), _jsx("p", { className: "text-xs text-gray-600 mb-3", children: "Vector search enabled for context enrichment" }), _jsxs("div", { className: "space-y-1 text-xs", children: [_jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-medium", children: "Embedding Model:" }), " Claude Embeddings"] }), _jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-medium", children: "Store:" }), " Supabase pgvector"] })] })] })] }) }));
}
//# sourceMappingURL=AgentSidebar.js.map