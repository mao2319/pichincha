import { claudeService } from '@/services/claude'
import { supabaseDb } from '@/services/supabase'
import { useAgentStore } from '@/stores/agentStore'
import {
  ProspectData,
  OnboardingRequest,
  AgentTrace,
  VerificationResult,
} from '@/types'

interface OrchestrationContext {
  requestId: string
  prospectData: ProspectData
  identityResult?: VerificationResult
  riskResult?: VerificationResult
  documentationResult?: VerificationResult
  orchestrationResult?: any
  clientResponse?: string
}

export class AgentOrchestrator {
  private context: OrchestrationContext
  private store = useAgentStore()

  constructor(requestId: string, prospectData: ProspectData) {
    this.context = { requestId, prospectData }
  }

  async executeVerification(): Promise<OnboardingRequest> {
    try {
      this.store.setIsProcessing(true)
      this.store.setError(null)

      // Step 1: Orchestration planning
      await this.orchestratePlan()

      // Step 2: Identity verification
      await this.verifyIdentity()

      // Step 3: Risk assessment
      await this.assessRisk()

      // Step 4: Documentation verification
      await this.verifyDocumentation()

      // Step 5: Final orchestration decision
      await this.makeFinalDecision()

      // Step 6: Generate client response
      await this.generateClientResponse()

      // Update request with final status
      const request = await this.updateFinalRequest()

      this.store.setIsProcessing(false)
      return request
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      this.store.setError(message)
      throw error
    }
  }

  private async orchestratePlan(): Promise<void> {
    const trace = this.createTrace('orchestrador', 'planning')
    this.store.updateAgentStatus('orchestrador', 'processing')

    try {
      const result = await claudeService.orchestrateVerification(
        this.context.prospectData
      )

      this.context.orchestrationResult = result

      await supabaseDb.createAgentTrace({
        request_id: this.context.requestId,
        agent_id: 'orchestrador',
        agent_name: 'Agente Orquestador',
        agent_type: 'orchestrador',
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        status: 'completed',
        input: { prospect_data: this.context.prospectData },
        output: result,
        model: 'claude-opus-5-5',
      })

      this.store.updateAgentStatus('orchestrador', 'completed')
    } catch (error) {
      this.handleAgentError('orchestrador', error)
    }
  }

  private async verifyIdentity(): Promise<void> {
    this.store.updateAgentStatus('identidad', 'processing')

    try {
      const result = await claudeService.verifyIdentity(
        this.context.prospectData
      )

      this.context.identityResult = result

      await supabaseDb.createAgentTrace({
        request_id: this.context.requestId,
        agent_id: 'identidad',
        agent_name: 'Agente Verifica Identidad',
        agent_type: 'identidad',
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        status: 'completed',
        input: { prospect_data: this.context.prospectData },
        output: result,
        model: 'claude-sonnet-5-5',
      })

      this.store.updateAgentStatus('identidad', 'completed')
    } catch (error) {
      this.handleAgentError('identidad', error)
    }
  }

  private async assessRisk(): Promise<void> {
    this.store.updateAgentStatus('riesgo', 'processing')

    try {
      const result = await claudeService.checkRiskFactors(
        this.context.prospectData
      )

      this.context.riskResult = result

      await supabaseDb.createAgentTrace({
        request_id: this.context.requestId,
        agent_id: 'riesgo',
        agent_name: 'Agente Listas de Riesgo',
        agent_type: 'riesgo',
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        status: 'completed',
        input: { prospect_data: this.context.prospectData },
        output: result,
        model: 'claude-sonnet-5-5',
      })

      this.store.updateAgentStatus('riesgo', 'completed')
    } catch (error) {
      this.handleAgentError('riesgo', error)
    }
  }

  private async verifyDocumentation(): Promise<void> {
    this.store.updateAgentStatus('documentacion', 'processing')

    try {
      const result = await claudeService.verifyDocumentation(
        this.context.prospectData
      )

      this.context.documentationResult = result

      await supabaseDb.createAgentTrace({
        request_id: this.context.requestId,
        agent_id: 'documentacion',
        agent_name: 'Agente Documentacion',
        agent_type: 'documentacion',
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        status: 'completed',
        input: { prospect_data: this.context.prospectData },
        output: result,
        model: 'claude-haiku-4-5-20251001',
      })

      this.store.updateAgentStatus('documentacion', 'completed')
    } catch (error) {
      this.handleAgentError('documentacion', error)
    }
  }

  private async makeFinalDecision(): Promise<void> {
    const consolidatedResult: VerificationResult = {
      identityVerified:
        this.context.identityResult?.identityVerified ?? false,
      riskLevel: this.context.riskResult?.riskLevel ?? 'medium',
      documentationStatus:
        this.context.documentationResult?.documentationStatus ?? 'pending',
      overallStatus: this.determineOverallStatus(),
      recommendedAction: this.generateRecommendation(),
      riskFactors: [
        ...(this.context.riskResult?.riskFactors ?? []),
        ...(this.context.identityResult?.riskFactors ?? []),
      ],
    }

    await supabaseDb.updateOnboardingRequest(this.context.requestId, {
      status: consolidatedResult.overallStatus,
      result: consolidatedResult,
      updated_at: new Date().toISOString(),
    })
  }

  private async generateClientResponse(): Promise<void> {
    this.store.updateAgentStatus('respuesta', 'processing')

    try {
      const result =
        this.context.identityResult || ({} as VerificationResult)
      const response = await claudeService.generateClientResponse(
        this.context.prospectData,
        result
      )

      this.context.clientResponse = response

      await supabaseDb.createAgentTrace({
        request_id: this.context.requestId,
        agent_id: 'respuesta',
        agent_name: 'Agente Respuesta Cliente',
        agent_type: 'respuesta',
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        status: 'completed',
        input: { prospect_data: this.context.prospectData },
        output: { response },
        model: 'claude-sonnet-5-5',
      })

      this.store.updateAgentStatus('respuesta', 'completed')
    } catch (error) {
      this.handleAgentError('respuesta', error)
    }
  }

  private async updateFinalRequest(): Promise<OnboardingRequest> {
    const request = await supabaseDb.getOnboardingRequest(
      this.context.requestId
    )
    this.store.setCurrentRequest(request)
    return request
  }

  private determineOverallStatus(): 'approved' | 'rejected' | 'ambiguous' {
    const identity = this.context.identityResult?.identityVerified ?? false
    const riskLevel = this.context.riskResult?.riskLevel ?? 'medium'
    const documentation =
      this.context.documentationResult?.documentationStatus === 'complete'

    if (!identity) return 'rejected'
    if (riskLevel === 'critical') return 'rejected'
    if (!documentation || riskLevel === 'high') return 'ambiguous'
    return 'approved'
  }

  private generateRecommendation(): string {
    const identity = this.context.identityResult?.identityVerified
    const riskLevel = this.context.riskResult?.riskLevel
    const documentation =
      this.context.documentationResult?.documentationStatus

    if (!identity) return 'Identity verification failed. Request manual review.'
    if (riskLevel === 'critical')
      return 'Critical risk factors detected. Proceed to legal review.'
    if (riskLevel === 'high')
      return 'High risk detected. Additional documentation required.'
    if (documentation !== 'complete')
      return 'Complete documentation submission required.'
    return 'All verifications passed. Proceed with approval.'
  }

  private createTrace(agentId: string, action: string): AgentTrace {
    const agent = this.store.getAgent(agentId)
    return {
      agentId,
      agentName: agent?.name || agentId,
      agentType: agent?.type || ('orchestrador' as const),
      startTime: new Date().toISOString(),
      status: 'in_progress',
      input: {},
      output: {},
      model: agent?.model || 'claude-opus-5-5',
    }
  }

  private handleAgentError(agentId: string, error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unknown error'
    this.store.updateAgentStatus(agentId, 'failed')
    console.error(`Agent ${agentId} failed:`, message)
  }
}
