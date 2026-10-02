export declare const embeddingsService: {
    generateEmbedding(text: string): Promise<number[]>;
    generateBatchEmbeddings(texts: string[]): Promise<{
        text: string;
        embedding: number[];
    }[]>;
    storeDocument(documentId: string, content: string, metadata: Record<string, unknown>): Promise<any>;
    searchSimilar(query: string, limit?: number, threshold?: number): Promise<any>;
};
//# sourceMappingURL=embeddings.d.ts.map