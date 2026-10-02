export interface Chunk {
  id: string
  content: string
  documentId: string
  startIndex: number
  endIndex: number
  chunkIndex: number
  metadata: Record<string, unknown>
}

export interface ChunkingStrategy {
  type: 'fixed-size' | 'semantic' | 'sentence'
  chunkSize: number
  overlap: number
}

export const chunkingService = {
  // Fixed size chunking - simplest approach
  chunkByFixedSize(
    text: string,
    documentId: string,
    chunkSize: number = 512,
    overlap: number = 50
  ): Chunk[] {
    const chunks: Chunk[] = []
    let chunkIndex = 0

    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      const end = Math.min(i + chunkSize, text.length)
      const chunkText = text.slice(i, end).trim()

      if (chunkText.length > 100) {
        chunks.push({
          id: `${documentId}-chunk-${chunkIndex}`,
          content: chunkText,
          documentId,
          startIndex: i,
          endIndex: end,
          chunkIndex,
          metadata: {
            strategy: 'fixed-size',
            chunkSize,
            overlap,
          },
        })
        chunkIndex++
      }
    }

    return chunks
  },

  // Sentence-based chunking - maintains context better
  chunkBySentences(
    text: string,
    documentId: string,
    sentencesPerChunk: number = 5,
    sentenceOverlap: number = 1
  ): Chunk[] {
    // Split by sentences (simplified regex)
    const sentenceRegex = /[.!?]+(?=\s|$)/g
    const sentences = text.split(sentenceRegex).map((s) => s.trim())

    const chunks: Chunk[] = []
    let chunkIndex = 0

    for (
      let i = 0;
      i < sentences.length;
      i += sentencesPerChunk - sentenceOverlap
    ) {
      const end = Math.min(i + sentencesPerChunk, sentences.length)
      const chunkSentences = sentences.slice(i, end)
      const chunkText = chunkSentences.join(' ').trim()

      if (chunkText.length > 100) {
        const startIndex = text.indexOf(chunkText)
        chunks.push({
          id: `${documentId}-chunk-${chunkIndex}`,
          content: chunkText,
          documentId,
          startIndex,
          endIndex: startIndex + chunkText.length,
          chunkIndex,
          metadata: {
            strategy: 'sentence',
            sentencesPerChunk,
            sentenceCount: chunkSentences.length,
          },
        })
        chunkIndex++
      }
    }

    return chunks
  },

  // Paragraph-based chunking - respects document structure
  chunkByParagraphs(
    text: string,
    documentId: string,
    paragraphsPerChunk: number = 3,
    overlap: number = 1
  ): Chunk[] {
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim())

    const chunks: Chunk[] = []
    let chunkIndex = 0

    for (
      let i = 0;
      i < paragraphs.length;
      i += paragraphsPerChunk - overlap
    ) {
      const end = Math.min(i + paragraphsPerChunk, paragraphs.length)
      const chunkParagraphs = paragraphs.slice(i, end)
      const chunkText = chunkParagraphs.join('\n\n').trim()

      if (chunkText.length > 100) {
        const startIndex = text.indexOf(chunkText)
        chunks.push({
          id: `${documentId}-chunk-${chunkIndex}`,
          content: chunkText,
          documentId,
          startIndex,
          endIndex: startIndex + chunkText.length,
          chunkIndex,
          metadata: {
            strategy: 'paragraph',
            paragraphsPerChunk,
            paragraphCount: chunkParagraphs.length,
          },
        })
        chunkIndex++
      }
    }

    return chunks
  },

  // Semantic chunking - uses sentence boundaries and size limits
  chunkSemantic(
    text: string,
    documentId: string,
    maxChunkSize: number = 500,
    minChunkSize: number = 100
  ): Chunk[] {
    // Split by sentences
    const sentenceRegex = /[.!?]+(?=\s|$)/g
    const sentences = text.split(sentenceRegex).map((s) => s.trim())

    const chunks: Chunk[] = []
    let currentChunk = ''
    let chunkIndex = 0
    let startIndex = 0

    for (const sentence of sentences) {
      const testChunk = currentChunk + (currentChunk ? ' ' : '') + sentence

      if (testChunk.length <= maxChunkSize) {
        currentChunk = testChunk
      } else {
        // Save current chunk if it's large enough
        if (currentChunk.length >= minChunkSize) {
          const chunkStartIndex = text.indexOf(currentChunk, startIndex)
          chunks.push({
            id: `${documentId}-chunk-${chunkIndex}`,
            content: currentChunk,
            documentId,
            startIndex: chunkStartIndex,
            endIndex: chunkStartIndex + currentChunk.length,
            chunkIndex,
            metadata: {
              strategy: 'semantic',
              maxChunkSize,
              minChunkSize,
            },
          })
          chunkIndex++
          startIndex = chunkStartIndex + currentChunk.length
        }

        // Start new chunk
        currentChunk = sentence
      }
    }

    // Handle remaining chunk
    if (currentChunk.length >= minChunkSize) {
      const chunkStartIndex = text.indexOf(currentChunk, startIndex)
      chunks.push({
        id: `${documentId}-chunk-${chunkIndex}`,
        content: currentChunk,
        documentId,
        startIndex: chunkStartIndex,
        endIndex: chunkStartIndex + currentChunk.length,
        chunkIndex,
        metadata: {
          strategy: 'semantic',
          maxChunkSize,
          minChunkSize,
        },
      })
    }

    return chunks
  },

  // Hybrid chunking - combines multiple strategies
  chunkHybrid(
    text: string,
    documentId: string,
    strategy: ChunkingStrategy = {
      type: 'semantic',
      chunkSize: 512,
      overlap: 50,
    }
  ): Chunk[] {
    switch (strategy.type) {
      case 'fixed-size':
        return this.chunkByFixedSize(
          text,
          documentId,
          strategy.chunkSize,
          strategy.overlap
        )
      case 'sentence':
        return this.chunkBySentences(
          text,
          documentId,
          Math.ceil(strategy.chunkSize / 50),
          strategy.overlap
        )
      case 'semantic':
        return this.chunkSemantic(
          text,
          documentId,
          strategy.chunkSize,
          Math.max(100, strategy.chunkSize - 200)
        )
      default:
        return this.chunkSemantic(text, documentId)
    }
  },

  // Merge small chunks with larger neighbors
  mergeSmallChunks(chunks: Chunk[], minSize: number = 200): Chunk[] {
    const merged: Chunk[] = []
    let i = 0

    while (i < chunks.length) {
      if (chunks[i].content.length < minSize && i < chunks.length - 1) {
        // Merge with next chunk
        const mergedContent =
          chunks[i].content + ' ' + chunks[i + 1].content
        merged.push({
          ...chunks[i],
          content: mergedContent,
          endIndex: chunks[i + 1].endIndex,
        })
        i += 2
      } else {
        merged.push(chunks[i])
        i++
      }
    }

    return merged
  },

  // Add context information to chunks
  enrichChunks(
    chunks: Chunk[],
    title: string,
    documentType: string
  ): Chunk[] {
    return chunks.map((chunk) => ({
      ...chunk,
      metadata: {
        ...chunk.metadata,
        documentTitle: title,
        documentType,
        totalChunks: chunks.length,
      },
    }))
  },

  // Calculate optimal chunk size based on document
  calculateOptimalChunkSize(textLength: number): number {
    // Heuristic: larger documents benefit from larger chunks
    if (textLength < 5000) return 256
    if (textLength < 20000) return 512
    if (textLength < 100000) return 1024
    return 2048
  },

  // Validate chunks for quality
  validateChunks(chunks: Chunk[]): { valid: Chunk[]; issues: string[] } {
    const issues: string[] = []
    const valid: Chunk[] = []

    chunks.forEach((chunk, idx) => {
      if (chunk.content.length < 50) {
        issues.push(`Chunk ${idx}: Too small (${chunk.content.length} chars)`)
      }
      if (chunk.content.length > 5000) {
        issues.push(`Chunk ${idx}: Too large (${chunk.content.length} chars)`)
      }
      if (!/[a-zA-Z0-9]/.test(chunk.content)) {
        issues.push(`Chunk ${idx}: No meaningful content`)
      } else {
        valid.push(chunk)
      }
    })

    return { valid, issues }
  },
}
