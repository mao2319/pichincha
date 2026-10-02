import { MCPConfig } from '@/types';
export declare const MCP_SERVERS: Record<string, MCPConfig>;
export declare const mcpConfig: {
    getEnabledServers(): MCPConfig[];
    getServer(id: string): MCPConfig | undefined;
    setServerEnabled(id: string, enabled: boolean): void;
    updateServerConfig(id: string, config: Record<string, unknown>): void;
    getServerStatus(id: string): Promise<boolean>;
    getAllServerStatuses(): Promise<Record<string, boolean>>;
};
//# sourceMappingURL=config.d.ts.map