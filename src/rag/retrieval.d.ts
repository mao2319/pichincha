export interface RAGDocument {
    id: string;
    documentId: string;
    content: string;
    metadata: Record<string, unknown>;
    similarity: number;
}
export interface RAGContext {
    query: string;
    documents: RAGDocument[];
    enrichedPrompt: string;
}
export declare const ragRetrieval: {
    retrieveContext(query: string, maxDocuments?: number, similarityThreshold?: number): Promise<RAGContext>;
    indexDocument(documentId: string, content: string, type: "policy" | "procedure" | "guideline" | "risk_assessment"): Promise<any>;
    indexDocuments(documents: {
        id: string;
        content: string;
        type: "policy" | "procedure" | "guideline" | "risk_assessment";
    }[]): Promise<({
        id: string;
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        id: string;
        success: boolean;
        error: string;
        data?: undefined;
    })[]>;
    getPolicyContext(prospectRiskLevel: string): Promise<string>;
    getProcedureGuidance(procedure: string): Promise<string>;
    searchByMetadata(metadata: Record<string, unknown>): Promise<any[]>;
    deleteDocument(documentId: string): Promise<boolean>;
    getDocumentStats(): Promise<Record<string, number>>;
};
//# sourceMappingURL=retrieval.d.ts.map