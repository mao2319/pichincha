import { VerificationResult } from '@/types';
export declare function formatDate(date: string | Date): string;
export declare function formatTime(date: string | Date): string;
export declare function calculateProcessingTime(startTime: string, endTime: string): string;
export declare function getRiskColor(riskLevel: 'low' | 'medium' | 'high' | 'critical'): string;
export declare function getStatusColor(status: 'approved' | 'rejected' | 'ambiguous' | 'pending' | 'in_progress'): string;
export declare function maskSensitiveData(value: string, type: string): string;
export declare function validateEmail(email: string): boolean;
export declare function validatePhoneNumber(phone: string): boolean;
export declare function calculateSuccessRate(approvedCount: number, totalCount: number): number;
export declare function getVerificationSummary(result: VerificationResult): string;
export declare function generateRequestId(): string;
export declare function sleep(ms: number): Promise<void>;
export declare function parseJwt(token: string): Record<string, unknown>;
export declare function sanitizeData(data: Record<string, unknown>): Record<string, unknown>;
//# sourceMappingURL=helpers.d.ts.map