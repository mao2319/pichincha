import { MCPConfig } from '@/types'

export const MCP_SERVERS: Record<string, MCPConfig> = {
  openwebui: {
    id: 'openwebui',
    name: 'OpenWebUI',
    description: 'Web-based UI for local AI models',
    type: 'web-interface',
    enabled: true,
    config: {
      url: 'http://localhost:8080',
      timeout: 30000,
    },
  },
  browserbase: {
    id: 'browserbase',
    name: 'Browserbase',
    description: 'Browser automation and web scraping',
    type: 'browser-automation',
    enabled: true,
    config: {
      apiKey: (import.meta.env.VITE_BROWSERBASE_API_KEY as string) || '',
      projectId: (import.meta.env.VITE_BROWSERBASE_PROJECT_ID as string) || '',
    },
  },
  github: {
    id: 'github',
    name: 'GitHub Integration',
    description: 'GitHub API integration for code analysis',
    type: 'code-repository',
    enabled: true,
    config: {
      token: (import.meta.env.VITE_GITHUB_TOKEN as string) || '',
      owner: 'mao2319',
      repo: 'pichincha',
    },
  },
}

export const mcpConfig = {
  // Get all enabled MCP servers
  getEnabledServers(): MCPConfig[] {
    return Object.values(MCP_SERVERS).filter((server) => server.enabled)
  },

  // Get specific MCP server config
  getServer(id: string): MCPConfig | undefined {
    return MCP_SERVERS[id]
  },

  // Enable/disable MCP server
  setServerEnabled(id: string, enabled: boolean): void {
    if (MCP_SERVERS[id]) {
      MCP_SERVERS[id].enabled = enabled
    }
  },

  // Update MCP server config
  updateServerConfig(id: string, config: Record<string, unknown>): void {
    if (MCP_SERVERS[id]) {
      MCP_SERVERS[id].config = { ...MCP_SERVERS[id].config, ...config }
    }
  },

  // Get server status
  async getServerStatus(id: string): Promise<boolean> {
    const server = this.getServer(id)
    if (!server || !server.enabled) return false

    try {
      if (server.type === 'web-interface') {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        try {
          const response = await fetch(
            (server.config.url as string) + '/health',
            { signal: controller.signal }
          )
          clearTimeout(timeoutId)
          return response.ok
        } catch {
          clearTimeout(timeoutId)
          return false
        }
      }
      // Add other server type health checks as needed
      return true
    } catch {
      return false
    }
  },

  // Get all server statuses
  async getAllServerStatuses(): Promise<Record<string, boolean>> {
    const statuses: Record<string, boolean> = {}
    const servers = this.getEnabledServers()

    for (const server of servers) {
      statuses[server.id] = await this.getServerStatus(server.id)
    }

    return statuses
  },
}
