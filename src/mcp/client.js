import { mcpConfig } from './config';
export const mcpClient = {
    // Call MCP server method
    async call(request) {
        const server = mcpConfig.getServer(request.serverId);
        if (!server) {
            return {
                success: false,
                error: `MCP server not found: ${request.serverId}`,
            };
        }
        if (!server.enabled) {
            return {
                success: false,
                error: `MCP server is disabled: ${request.serverId}`,
            };
        }
        try {
            // Implementation depends on the specific MCP server type
            switch (server.type) {
                case 'web-interface':
                    return await this.callWebInterfaceServer(server, request);
                case 'browser-automation':
                    return await this.callBrowserAutomationServer(server, request);
                case 'code-repository':
                    return await this.callCodeRepositoryServer(server, request);
                default:
                    return {
                        success: false,
                        error: `Unknown server type: ${server.type}`,
                    };
            }
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    },
    // Call web interface server
    async callWebInterfaceServer(server, request) {
        const url = `${server.config.url}/api/${request.method}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.params || {}),
        });
        if (!response.ok) {
            return {
                success: false,
                error: `Server error: ${response.statusText}`,
            };
        }
        const data = await response.json();
        return {
            success: true,
            data,
        };
    },
    // Call browser automation server
    async callBrowserAutomationServer(server, request) {
        const apiKey = server.config.apiKey;
        if (!apiKey) {
            return {
                success: false,
                error: 'Missing API key for browser automation server',
            };
        }
        // Example: Browserbase API call
        const response = await fetch('https://api.browserbase.com/v1/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(request.params || {}),
        });
        if (!response.ok) {
            return {
                success: false,
                error: `Browser automation server error: ${response.statusText}`,
            };
        }
        const data = await response.json();
        return {
            success: true,
            data,
        };
    },
    // Call code repository server
    async callCodeRepositoryServer(server, request) {
        const token = server.config.token;
        if (!token) {
            return {
                success: false,
                error: 'Missing token for code repository server',
            };
        }
        const baseUrl = 'https://api.github.com';
        const url = `${baseUrl}${request.method}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });
        if (!response.ok) {
            return {
                success: false,
                error: `Code repository server error: ${response.statusText}`,
            };
        }
        const data = await response.json();
        return {
            success: true,
            data,
        };
    },
    // Get available methods for a server
    async getAvailableMethods(serverId) {
        const server = mcpConfig.getServer(serverId);
        if (!server)
            return [];
        // This would typically come from the server's capability list
        const methodsByType = {
            'web-interface': ['query', 'analyze', 'summarize'],
            'browser-automation': ['navigate', 'screenshot', 'interact'],
            'code-repository': ['search', 'analyze', 'blame'],
        };
        return methodsByType[server.type] || [];
    },
    // Batch call multiple MCP methods
    async callBatch(requests) {
        const promises = requests.map((req) => this.call(req));
        return Promise.all(promises);
    },
};
//# sourceMappingURL=client.js.map