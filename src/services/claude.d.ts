import Anthropic from '@anthropic-ai/sdk';
import { VerificationResult } from '@/types';
export interface ClaudeMessageOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    system?: string;
}
export declare const claudeService: {
    createMessage(messages: any[], options?: ClaudeMessageOptions): Promise<Anthropic.Messages.Message>;
    analyzeProspect(prospectData: any, agentType: string): Promise<Anthropic.Messages.Message>;
    verifyIdentity(prospectData: any): Promise<VerificationResult>;
    checkRiskFactors(prospectData: any): Promise<VerificationResult>;
    verifyDocumentation(prospectData: any): Promise<VerificationResult>;
    orchestrateVerification(prospectData: any): Promise<any>;
    generateClientResponse(prospectData: any, verificationResult: VerificationResult): Promise<string>;
};
//# sourceMappingURL=claude.d.ts.map