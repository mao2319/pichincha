import { OnboardingRequest, ProspectData } from '@/types'
import { mockMcpServer } from '@/mcp/mockServer'
import { AgentOrchestrator } from '@/agents/orchestrator'
import { supabaseDb } from './supabase'

export interface OnboardingStartRequest {
  prospect_name: string
  document_id: string
  product: string
  email?: string
  phone?: string
  document_type?: string
}

export interface OnboardingStartResponse {
  success: boolean
  request_id?: string
  message: string
  data?: OnboardingRequest
  error?: string
}

export const apiService = {
  // Start onboarding process
  async startOnboarding(
    payload: OnboardingStartRequest
  ): Promise<OnboardingStartResponse> {
    try {
      // Validate required fields
      if (!payload.prospect_name || !payload.document_id || !payload.product) {
        return {
          success: false,
          message: 'Missing required fields',
          error: 'prospect_name, document_id, and product are required',
        }
      }

      // Step 1: Call mock MCP server for initial verification
      const mcpResults = await mockMcpServer.verifyAll(
        payload.prospect_name,
        payload.document_id,
        payload.product
      )

      // Step 2: Create prospect record
      const nameParts = payload.prospect_name.split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ')

      const prospect = await supabaseDb.createProspect({
        first_name: firstName,
        last_name: lastName,
        email: payload.email || `${firstName.toLowerCase()}@example.com`,
        phone: payload.phone || '',
        document_type: payload.document_type || 'national_id',
        document_number: payload.document_id,
        date_of_birth: '1990-01-01', // Default for mock
        address: '', // Provided by MCP in real scenario
        city: '', // Provided by MCP in real scenario
        country: 'EC', // Ecuador default
        occupation: '', // Can be determined from other sources
        monthly_income: 0, // Can be determined from other sources
      })

      // Step 3: Create onboarding request
      const request = await supabaseDb.createOnboardingRequest({
        prospect_id: prospect.id,
        status: mcpResults.summary.requiresEscalation
          ? 'ambiguous'
          : 'in_progress',
        result: {
          mcp_verification: mcpResults,
        },
      })

      // Step 4: Trigger agent orchestration if not requiring immediate escalation
      if (!mcpResults.summary.requiresEscalation) {
        const prospectData: ProspectData = {
          id: prospect.id,
          firstName,
          lastName,
          email: payload.email || prospect.email,
          phone: payload.phone || '',
          documentType: payload.document_type || 'national_id',
          documentNumber: payload.document_id,
          dateOfBirth: '1990-01-01',
          address: '',
          city: '',
          country: 'EC',
          occupation: '',
          monthlyIncome: 0,
          createdAt: new Date().toISOString(),
        }

        // Start orchestration in background
        const orchestrator = new AgentOrchestrator(request.id, prospectData)
        orchestrator.executeVerification().catch((error) => {
          console.error('Orchestration error:', error)
          // Update request status to failed
          supabaseDb.updateOnboardingRequest(request.id, {
            status: 'ambiguous',
          })
        })
      }

      // Fetch complete request with all data
      const completeRequest = await supabaseDb.getOnboardingRequest(request.id)

      return {
        success: true,
        request_id: request.id,
        message: mcpResults.summary.requiresEscalation
          ? 'Onboarding started - Escalation required'
          : 'Onboarding started - Processing verification',
        data: completeRequest,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        message: 'Failed to start onboarding',
        error: errorMessage,
      }
    }
  },

  // Get onboarding request status
  async getOnboardingStatus(
    requestId: string
  ): Promise<{ success: boolean; data?: OnboardingRequest; error?: string }> {
    try {
      const request = await supabaseDb.getOnboardingRequest(requestId)
      return {
        success: true,
        data: request,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  // List onboarding requests
  async listOnboardingRequests(filters?: {
    status?: string
    limit?: number
  }): Promise<{
    success: boolean
    data?: { requests: OnboardingRequest[]; count: number }
    error?: string
  }> {
    try {
      const result = await supabaseDb.listOnboardingRequests(filters)
      return {
        success: true,
        data: result,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  // Test MCP server tools
  async testMCPTools(documentId: string, prospectName: string) {
    try {
      const results = await mockMcpServer.verifyAll(
        prospectName,
        documentId,
        'cuenta_ahorros'
      )

      return {
        success: true,
        data: results,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },
}
