import { OnboardingRequest } from '@/types';
export interface OnboardingStartRequest {
    prospect_name: string;
    document_id: string;
    product: string;
    email?: string;
    phone?: string;
    document_type?: string;
}
export interface OnboardingStartResponse {
    success: boolean;
    request_id?: string;
    message: string;
    data?: OnboardingRequest;
    error?: string;
}
export declare const apiService: {
    startOnboarding(payload: OnboardingStartRequest): Promise<OnboardingStartResponse>;
    getOnboardingStatus(requestId: string): Promise<{
        success: boolean;
        data?: OnboardingRequest;
        error?: string;
    }>;
    listOnboardingRequests(filters?: {
        status?: string;
        limit?: number;
    }): Promise<{
        success: boolean;
        data?: {
            requests: OnboardingRequest[];
            count: number;
        };
        error?: string;
    }>;
    testMCPTools(documentId: string, prospectName: string): Promise<{
        success: boolean;
        data: {
            identity: import("@/mcp/mockServer").VerifyIdentityResult;
            risk: import("@/mcp/mockServer").CheckRiskListsResult;
            documentation: import("@/mcp/mockServer").PrepareDocumentationResult;
            timestamp: string;
            summary: {
                overallStatus: string;
                requiresEscalation: boolean;
                confidenceScore: number;
                riskScore: number;
            };
        };
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
};
//# sourceMappingURL=api.d.ts.map