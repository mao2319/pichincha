import { supabase } from '@/services/supabase'

interface EmbeddingParams {
  input: string
  model?: string
}

interface EmbeddingResponse {
  embedding: number[]
  usage: {
    input_tokens: number
  }
}

export const embeddingsService = {
  // Generate embeddings using Claude API
  async generateEmbedding(text: string): Promise<number[]> {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('Missing VITE_ANTHROPIC_API_KEY')
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-5-5',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `Generate a JSON array of 1536 numerical values between -1 and 1 that represents the semantic embedding of this text. Only return the JSON array, no other text.\n\nText: "${text}"`,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.content[0].text

      // Parse the embedding array from response
      const embedding = JSON.parse(content)
      if (!Array.isArray(embedding) || embedding.length !== 1536) {
        throw new Error('Invalid embedding format')
      }

      return embedding
    } catch (error) {
      console.error('Embedding generation error:', error)
      throw error
    }
  },

  // Batch generate embeddings
  async generateBatchEmbeddings(
    texts: string[]
  ): Promise<{ text: string; embedding: number[] }[]> {
    const results = []

    for (const text of texts) {
      try {
        const embedding = await this.generateEmbedding(text)
        results.push({ text, embedding })
      } catch (error) {
        console.error(`Failed to generate embedding for: ${text}`, error)
      }
    }

    return results
  },

  // Store document with embedding
  async storeDocument(
    documentId: string,
    content: string,
    metadata: Record<string, unknown>
  ) {
    try {
      const embedding = await this.generateEmbedding(content)

      const { data, error } = await supabase
        .from('rag_documents')
        .insert([
          {
            document_id: documentId,
            content,
            embedding,
            metadata,
            created_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) throw new Error(error.message)
      return data[0]
    } catch (error) {
      console.error('Error storing document:', error)
      throw error
    }
  },

  // Similarity search
  async searchSimilar(
    query: string,
    limit: number = 5,
    threshold: number = 0.7
  ) {
    try {
      const queryEmbedding = await this.generateEmbedding(query)

      // Use pgvector similarity search
      const { data, error } = await supabase.rpc('search_documents', {
        query_embedding: queryEmbedding,
        similarity_threshold: threshold,
        match_count: limit,
      })

      if (error) throw new Error(error.message)
      return data
    } catch (error) {
      console.error('Error in similarity search:', error)
      throw error
    }
  },
}
