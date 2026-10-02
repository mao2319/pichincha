import { useState } from 'react'
import { Menu, X, Zap, Settings } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const navItems: NavItem[] = [
    { id: 'models', label: 'Available Models', icon: '🤖', badge: '3' },
    { id: 'agents', label: 'Agents', icon: '⚙️', badge: '5' },
    { id: 'mcp', label: 'MCP Servers', icon: '🔌', badge: '3' },
    { id: 'rag', label: 'RAG Engine', icon: '📚' },
  ]

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Pichincha AI</h1>
              <p className="text-xs text-blue-100">Onboarding Platform</p>
            </div>
          </div>

          {/* Navigation Items - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-white text-blue-900 font-semibold shadow-md'
                    : 'text-white hover:bg-blue-700 hover:bg-opacity-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-400 text-blue-900 rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500 bg-opacity-20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-200">All Systems Active</span>
            </div>

            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-blue-700 hover:bg-opacity-50 transition-all">
              <Settings className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-700 hover:bg-opacity-50"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setIsMenuOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  activeSection === item.id
                    ? 'bg-white text-blue-900 font-semibold'
                    : 'text-white hover:bg-blue-700 hover:bg-opacity-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-yellow-400 text-blue-900 rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="bg-blue-900 bg-opacity-50 border-t border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 text-sm text-blue-100">
            <div className="flex items-center gap-4">
              <span>
                <strong>Active Section:</strong>{' '}
                {activeSection
                  ? navItems.find((n) => n.id === activeSection)?.label
                  : 'Dashboard'}
              </span>
            </div>
            <div className="text-xs text-blue-200">
              Last updated: {new Date().toLocaleTimeString('es-ES')}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
