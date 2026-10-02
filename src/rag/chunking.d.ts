export interface Chunk {
    id: string;
    content: string;
    documentId: string;
    startIndex: number;
    endIndex: number;
    chunkIndex: number;
    metadata: Record<string, unknown>;
}
export interface ChunkingStrategy {
    type: 'fixed-size' | 'semantic' | 'sentence';
    chunkSize: number;
    overlap: number;
}
export declare const chunkingService: {
    chunkByFixedSize(text: string, documentId: string, chunkSize?: number, overlap?: number): Chunk[];
    chunkBySentences(text: string, documentId: string, sentencesPerChunk?: number, sentenceOverlap?: number): Chunk[];
    chunkByParagraphs(text: string, documentId: string, paragraphsPerChunk?: number, overlap?: number): Chunk[];
    chunkSemantic(text: string, documentId: string, maxChunkSize?: number, minChunkSize?: number): Chunk[];
    chunkHybrid(text: string, documentId: string, strategy?: ChunkingStrategy): Chunk[];
    mergeSmallChunks(chunks: Chunk[], minSize?: number): Chunk[];
    enrichChunks(chunks: Chunk[], title: string, documentType: string): Chunk[];
    calculateOptimalChunkSize(textLength: number): number;
    validateChunks(chunks: Chunk[]): {
        valid: Chunk[];
        issues: string[];
    };
};
//# sourceMappingURL=chunking.d.ts.map