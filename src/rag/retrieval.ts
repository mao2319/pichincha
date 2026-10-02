import { embeddingsService } from './embeddings'
import { supabase } from '@/services/supabase'

export interface RAGDocument {
  id: string
  documentId: string
  content: string
  metadata: Record<string, unknown>
  similarity: number
}

export interface RAGContext {
  query: string
  documents: RAGDocument[]
  enrichedPrompt: string
}

export const ragRetrieval = {
  // Retrieve relevant documents for a query
  async retrieveContext(
    query: string,
    maxDocuments: number = 5,
    similarityThreshold: number = 0.7
  ): Promise<RAGContext> {
    try {
      // Get similar documents
      const documents = await embeddingsService.searchSimilar(
        query,
        maxDocuments,
        similarityThreshold
      )

      // Build enriched prompt with context
      const documentContext = documents
        .map(
          (doc: RAGDocument, idx: number) =>
            `[Document ${idx + 1}] (Similarity: ${(doc.similarity * 100).toFixed(1)}%)\n${doc.content}`
        )
        .join('\n\n')

      const enrichedPrompt = `
You have access to the following relevant documents to help answer the query:

${documentContext}

---

Now, please answer the following query using the provided documents as context:

${query}
`

      return {
        query,
        documents,
        enrichedPrompt,
      }
    } catch (error) {
      console.error('Error retrieving RAG context:', error)
      throw error
    }
  },

  // Index a knowledge base document
  async indexDocument(
    documentId: string,
    content: string,
    type: 'policy' | 'procedure' | 'guideline' | 'risk_assessment'
  ) {
    try {
      const metadata = {
        type,
        indexed_at: new Date().toISOString(),
        source: 'knowledge_base',
      }

      const result = await embeddingsService.storeDocument(
        documentId,
        content,
        metadata
      )

      return result
    } catch (error) {
      console.error('Error indexing document:', error)
      throw error
    }
  },

  // Batch index multiple documents
  async indexDocuments(
    documents: {
      id: string
      content: string
      type: 'policy' | 'procedure' | 'guideline' | 'risk_assessment'
    }[]
  ) {
    const results = []

    for (const doc of documents) {
      try {
        const result = await this.indexDocument(doc.id, doc.content, doc.type)
        results.push({ id: doc.id, success: true, data: result })
      } catch (error) {
        results.push({
          id: doc.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return results
  },

  // Get policy context for verification
  async getPolicyContext(prospectRiskLevel: string): Promise<string> {
    try {
      const query = `Risk assessment guidelines for ${prospectRiskLevel} risk clients`
      const context = await this.retrieveContext(query, 3, 0.6)

      return context.enrichedPrompt
    } catch (error) {
      console.error('Error getting policy context:', error)
      return ''
    }
  },

  // Get procedural guidance
  async getProcedureGuidance(procedure: string): Promise<string> {
    try {
      const context = await this.retrieveContext(procedure, 5, 0.7)
      return context.enrichedPrompt
    } catch (error) {
      console.error('Error getting procedure guidance:', error)
      return ''
    }
  },

  // Search documents by metadata
  async searchByMetadata(metadata: Record<string, unknown>) {
    try {
      const { data, error } = await supabase
        .from('rag_documents')
        .select('*')

      if (error) throw new Error(error.message)

      // Filter by metadata (basic implementation)
      return data.filter((doc: RAGDocument) => {
        return Object.entries(metadata).every(
          ([key, value]) => doc.metadata[key] === value
        )
      })
    } catch (error) {
      console.error('Error searching by metadata:', error)
      throw error
    }
  },

  // Delete indexed document
  async deleteDocument(documentId: string) {
    try {
      const { error } = await supabase
        .from('rag_documents')
        .delete()
        .eq('document_id', documentId)

      if (error) throw new Error(error.message)
      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  },

  // Get document statistics
  async getDocumentStats() {
    try {
      const { data, error } = await supabase
        .from('rag_documents')
        .select('metadata->type as type', { count: 'exact' })

      if (error) throw new Error(error.message)

      // Group by type
      const stats: Record<string, number> = {}
      data?.forEach((item: any) => {
        const type = item.type || 'unknown'
        stats[type] = (stats[type] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error('Error getting document stats:', error)
      return {}
    }
  },
}
