import Anthropic from '@anthropic-ai/sdk'
import { VerificationResult } from '@/types'

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string
if (!apiKey) {
  throw new Error('Missing VITE_ANTHROPIC_API_KEY environment variable')
}

const client = new Anthropic({ apiKey })

export interface ClaudeMessageOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  system?: string
}

export const claudeService = {
  async createMessage(
    messages: any[],
    options?: ClaudeMessageOptions
  ) {
    const response = await client.messages.create({
      model: options?.model || 'claude-opus-5-5',
      max_tokens: options?.maxTokens || 2048,
      temperature: options?.temperature || 0.7,
      system: options?.system || 'You are an helpful AI assistant.',
      messages,
    })

    return response
  },

  async analyzeProspect(prospectData: any, agentType: string) {
    const systemPrompt = getAgentSystemPrompt(agentType)

    const response = await this.createMessage(
      [
        {
          role: 'user',
          content: `Analyze the following prospect data:\n\n${JSON.stringify(prospectData, null, 2)}`,
        },
      ],
      {
        system: systemPrompt,
        model: 'claude-opus-5-5',
        maxTokens: 2048,
      }
    )

    return response
  },

  async verifyIdentity(prospectData: any): Promise<VerificationResult> {
    const response = await this.analyzeProspect(prospectData, 'identidad')

    return parseVerificationResult(response)
  },

  async checkRiskFactors(prospectData: any): Promise<VerificationResult> {
    const response = await this.analyzeProspect(prospectData, 'riesgo')

    return parseVerificationResult(response)
  },

  async verifyDocumentation(prospectData: any): Promise<VerificationResult> {
    const response = await this.analyzeProspect(prospectData, 'documentacion')

    return parseVerificationResult(response)
  },

  async orchestrateVerification(prospectData: any) {
    const systemPrompt = `
You are the Agente Orquestador (Orchestrator Agent). Your role is to coordinate the verification process by:
1. Analyzing the prospect data
2. Determining which verification agents need to be involved
3. Consolidating results from other agents
4. Making a final recommendation (approved, rejected, or ambiguous)

Respond with a JSON object containing:
{
  "overallStatus": "approved|rejected|ambiguous",
  "recommendedAction": "string describing the action",
  "riskLevel": "low|medium|high|critical",
  "agentsRequired": ["identidad", "riesgo", "documentacion"],
  "confidence": 0.0-1.0,
  "reasoning": "detailed explanation"
}
`

    const response = await this.createMessage(
      [
        {
          role: 'user',
          content: `Orchestrate verification for this prospect:\n\n${JSON.stringify(prospectData, null, 2)}`,
        },
      ],
      {
        system: systemPrompt,
        model: 'claude-opus-5-5',
        maxTokens: 2048,
      }
    )

    return parseOrchestrationResult(response)
  },

  async generateClientResponse(prospectData: any, verificationResult: VerificationResult) {
    const systemPrompt = `
You are the Agente Respuesta Cliente (Client Response Agent). Your role is to generate professional,
clear client communication based on verification results. Respond in Spanish.
`

    const response = await this.createMessage(
      [
        {
          role: 'user',
          content: `Generate a client response for this verification:\n\nProspect: ${JSON.stringify(prospectData, null, 2)}\n\nResult: ${JSON.stringify(verificationResult, null, 2)}`,
        },
      ],
      {
        system: systemPrompt,
        model: 'claude-sonnet-5-5',
        maxTokens: 1024,
      }
    )

    return extractTextContent(response)
  },
}

function getAgentSystemPrompt(agentType: string): string {
  const prompts: Record<string, string> = {
    identidad: `
You are the Agente Verifica Identidad (Identity Verification Agent). Analyze the prospect's identity data and verify:
1. Document validity and format
2. Age verification
3. Identity consistency across all provided fields
Respond with a JSON object: { "verified": boolean, "confidence": 0-1, "issues": [...], "recommendations": [...] }
`,
    riesgo: `
You are the Agente Listas de Riesgo (Risk Lists Agent). Check for risk factors:
1. PEP (Politically Exposed Persons) list
2. OFAC sanctions
3. AML risk indicators
4. Financial stability indicators
Respond with a JSON object: { "riskLevel": "low|medium|high|critical", "factors": [...], "recommendations": [...] }
`,
    documentacion: `
You are the Agente Documentacion (Documentation Agent). Verify documentation completeness:
1. Required documents present
2. Document validity
3. Any additional documents needed
Respond with a JSON object: { "complete": boolean, "missing": [...], "recommendations": [...] }
`,
    orchestrador: `
You are the Agente Orquestador (Orchestrator Agent). Coordinate the entire verification process.
`,
    respuesta: `
You are the Agente Respuesta Cliente (Client Response Agent). Generate professional client communications.
`,
  }

  return prompts[agentType] || prompts.orchestrador
}

function extractTextContent(response: any): string {
  if (response.content && response.content[0]) {
    return response.content[0].text
  }
  return ''
}

function parseVerificationResult(response: any): VerificationResult {
  const content = extractTextContent(response)

  try {
    const parsed = JSON.parse(content)
    return {
      identityVerified: parsed.verified || false,
      riskLevel: parsed.riskLevel || 'medium',
      documentationStatus: parsed.complete ? 'complete' : 'incomplete',
      overallStatus: 'ambiguous',
      recommendedAction: parsed.recommendations?.join(', ') || 'Review required',
      riskFactors: parsed.factors || parsed.issues || [],
    }
  } catch {
    return {
      identityVerified: false,
      riskLevel: 'medium',
      documentationStatus: 'pending',
      overallStatus: 'ambiguous',
      recommendedAction: 'Manual review required - parsing error',
      riskFactors: [],
    }
  }
}

function parseOrchestrationResult(response: any): any {
  const content = extractTextContent(response)

  try {
    return JSON.parse(content)
  } catch {
    return {
      overallStatus: 'ambiguous',
      recommendedAction: 'Manual review required',
      riskLevel: 'medium',
      confidence: 0,
      reasoning: 'Failed to parse orchestration result',
    }
  }
}
