export interface MCPRequest {
    method: string;
    params?: Record<string, unknown>;
    serverId: string;
}
export interface MCPResponse {
    success: boolean;
    data?: unknown;
    error?: string;
}
export declare const mcpClient: {
    call(request: MCPRequest): Promise<MCPResponse>;
    callWebInterfaceServer(server: any, request: MCPRequest): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        error?: undefined;
    }>;
    callBrowserAutomationServer(server: any, request: MCPRequest): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        error?: undefined;
    }>;
    callCodeRepositoryServer(server: any, request: MCPRequest): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        error?: undefined;
    }>;
    getAvailableMethods(serverId: string): Promise<string[]>;
    callBatch(requests: MCPRequest[]): Promise<MCPResponse[]>;
};
//# sourceMappingURL=client.d.ts.map