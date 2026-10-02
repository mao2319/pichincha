export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
export declare const supabaseDb: {
    createProspect(data: any): Promise<any>;
    getProspect(id: string): Promise<any>;
    createOnboardingRequest(data: any): Promise<any>;
    getOnboardingRequest(id: string): Promise<any>;
    updateOnboardingRequest(id: string, updates: any): Promise<any>;
    listOnboardingRequests(filters?: any): Promise<{
        requests: any[];
        count: number | null;
    }>;
    createAgentTrace(data: any): Promise<any>;
    updateAgentTrace(id: string, updates: any): Promise<any>;
    getStatistics(): Promise<any>;
    subscribeToOnboardingRequests(callback: any, _statusFilter?: any): import("@supabase/realtime-js").RealtimeChannel;
    subscribeToAgentTraces(requestId: string, callback: any): import("@supabase/realtime-js").RealtimeChannel;
};
//# sourceMappingURL=supabase.d.ts.map