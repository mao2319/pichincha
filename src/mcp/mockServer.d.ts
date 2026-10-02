export interface VerifyIdentityResult {
    verified: boolean;
    confidence: number;
    requiresEscalation: boolean;
    details: {
        documentValidity: boolean;
        ageVerified: boolean;
        consistencyScore: number;
    };
}
export interface CheckRiskListsResult {
    risk_level: 'low' | 'medium' | 'high';
    matches: string[];
    requiresEscalation: boolean;
    details: {
        pep_match: boolean;
        ofac_match: boolean;
        aml_score: number;
    };
}
export interface PrepareDocumentationResult {
    required_documents: string[];
    additional_documents?: string[];
    deadline: string;
    product_specific: Record<string, unknown>;
}
export declare const mockMcpServer: {
    verify_identity(_documentId: string): Promise<VerifyIdentityResult>;
    check_risk_lists(name: string, _documentId: string): Promise<CheckRiskListsResult>;
    prepare_documentation(product: string, _clientData?: any): Promise<PrepareDocumentationResult>;
    verifyAll(prospectName: string, documentId: string, product: string): Promise<{
        identity: VerifyIdentityResult;
        risk: CheckRiskListsResult;
        documentation: PrepareDocumentationResult;
        timestamp: string;
        summary: {
            overallStatus: string;
            requiresEscalation: boolean;
            confidenceScore: number;
            riskScore: number;
        };
    }>;
};
//# sourceMappingURL=mockServer.d.ts.map