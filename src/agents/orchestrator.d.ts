import { ProspectData, OnboardingRequest } from '@/types';
export declare class AgentOrchestrator {
    private context;
    private store;
    constructor(requestId: string, prospectData: ProspectData);
    executeVerification(): Promise<OnboardingRequest>;
    private orchestratePlan;
    private verifyIdentity;
    private assessRisk;
    private verifyDocumentation;
    private makeFinalDecision;
    private generateClientResponse;
    private updateFinalRequest;
    private determineOverallStatus;
    private generateRecommendation;
    private handleAgentError;
}
//# sourceMappingURL=orchestrator.d.ts.map