import { createClient } from '@supabase/supabase-js';
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '');
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '');
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});
// Database operations
export const supabaseDb = {
    // Prospect operations
    async createProspect(data) {
        const { data: prospect, error } = await supabase
            .from('prospects')
            .insert([data])
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return prospect;
    },
    async getProspect(id) {
        const { data, error } = await supabase
            .from('prospects')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    },
    // Onboarding Request operations
    async createOnboardingRequest(data) {
        const { data: request, error } = await supabase
            .from('onboarding_requests')
            .insert([data])
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return request;
    },
    async getOnboardingRequest(id) {
        const { data, error } = await supabase
            .from('onboarding_requests')
            .select('*, traces:agent_traces(*)')
            .eq('id', id)
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    },
    async updateOnboardingRequest(id, updates) {
        const { data, error } = await supabase
            .from('onboarding_requests')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    },
    async listOnboardingRequests(filters) {
        let query = supabase
            .from('onboarding_requests')
            .select('*, traces:agent_traces(*)')
            .order('created_at', { ascending: false });
        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        const { data, error, count } = await query;
        if (error)
            throw new Error(error.message);
        return { requests: data, count };
    },
    // Agent Trace operations
    async createAgentTrace(data) {
        const { data: trace, error } = await supabase
            .from('agent_traces')
            .insert([data])
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return trace;
    },
    async updateAgentTrace(id, updates) {
        const { data, error } = await supabase
            .from('agent_traces')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    },
    // Statistics
    async getStatistics() {
        const { data, error } = await supabase
            .rpc('get_statistics');
        if (error)
            throw new Error(error.message);
        return data;
    },
    // Real-time subscriptions
    subscribeToOnboardingRequests(callback, _statusFilter) {
        return supabase
            .channel('onboarding_requests_changes')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'onboarding_requests',
        }, callback)
            .subscribe();
    },
    subscribeToAgentTraces(requestId, callback) {
        return supabase
            .channel(`agent_traces_${requestId}`)
            .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'agent_traces',
            filter: `request_id=eq.${requestId}`,
        }, callback)
            .subscribe();
    },
};
//# sourceMappingURL=supabase.js.map