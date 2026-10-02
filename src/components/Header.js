import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Menu, X, Zap, Settings } from 'lucide-react';
export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const navItems = [
        { id: 'models', label: 'Available Models', icon: '🤖', badge: '3' },
        { id: 'agents', label: 'Agents', icon: '⚙️', badge: '5' },
        { id: 'mcp', label: 'MCP Servers', icon: '🔌', badge: '3' },
        { id: 'rag', label: 'RAG Engine', icon: '📚' },
    ];
    return (_jsxs("header", { className: "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-lg", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center justify-between h-20", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-white rounded-lg flex items-center justify-center", children: _jsx(Zap, { className: "w-6 h-6 text-blue-900" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold", children: "Pichincha AI" }), _jsx("p", { className: "text-xs text-blue-100", children: "Onboarding Platform" })] })] }), _jsx("nav", { className: "hidden lg:flex items-center gap-1", children: navItems.map((item) => (_jsxs("button", { onClick: () => setActiveSection(item.id), className: `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeSection === item.id
                                        ? 'bg-white text-blue-900 font-semibold shadow-md'
                                        : 'text-white hover:bg-blue-700 hover:bg-opacity-50'}`, children: [_jsx("span", { children: item.icon }), _jsx("span", { children: item.label }), item.badge && (_jsx("span", { className: "ml-1 px-2 py-0.5 text-xs bg-yellow-400 text-blue-900 rounded-full font-semibold", children: item.badge }))] }, item.id))) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500 bg-opacity-20", children: [_jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-xs text-green-200", children: "All Systems Active" })] }), _jsx("button", { className: "p-2 rounded-lg hover:bg-blue-700 hover:bg-opacity-50 transition-all", children: _jsx(Settings, { className: "w-5 h-5" }) }), _jsx("button", { onClick: () => setIsMenuOpen(!isMenuOpen), className: "lg:hidden p-2 rounded-lg hover:bg-blue-700 hover:bg-opacity-50", children: isMenuOpen ? (_jsx(X, { className: "w-5 h-5" })) : (_jsx(Menu, { className: "w-5 h-5" })) })] })] }), isMenuOpen && (_jsx("div", { className: "lg:hidden pb-4 space-y-2", children: navItems.map((item) => (_jsxs("button", { onClick: () => {
                                setActiveSection(item.id);
                                setIsMenuOpen(false);
                            }, className: `w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${activeSection === item.id
                                ? 'bg-white text-blue-900 font-semibold'
                                : 'text-white hover:bg-blue-700 hover:bg-opacity-50'}`, children: [_jsx("span", { children: item.icon }), _jsx("span", { children: item.label }), item.badge && (_jsx("span", { className: "ml-auto px-2 py-0.5 text-xs bg-yellow-400 text-blue-900 rounded-full font-semibold", children: item.badge }))] }, item.id))) }))] }), _jsx("div", { className: "bg-blue-900 bg-opacity-50 border-t border-blue-700", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-12 text-sm text-blue-100", children: [_jsx("div", { className: "flex items-center gap-4", children: _jsxs("span", { children: [_jsx("strong", { children: "Active Section:" }), ' ', activeSection
                                            ? navItems.find((n) => n.id === activeSection)?.label
                                            : 'Dashboard'] }) }), _jsxs("div", { className: "text-xs text-blue-200", children: ["Last updated: ", new Date().toLocaleTimeString('es-ES')] })] }) }) })] }));
}
//# sourceMappingURL=Header.js.map