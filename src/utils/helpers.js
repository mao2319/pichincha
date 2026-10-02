export function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
export function formatTime(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}
export function calculateProcessingTime(startTime, endTime) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const seconds = Math.floor((end - start) / 1000);
    if (seconds < 60)
        return `${seconds}s`;
    if (seconds < 3600)
        return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
}
export function getRiskColor(riskLevel) {
    const colors = {
        low: 'text-green-600 bg-green-50',
        medium: 'text-yellow-600 bg-yellow-50',
        high: 'text-orange-600 bg-orange-50',
        critical: 'text-red-600 bg-red-50',
    };
    return colors[riskLevel];
}
export function getStatusColor(status) {
    const colors = {
        approved: 'text-green-600 bg-green-50',
        rejected: 'text-red-600 bg-red-50',
        ambiguous: 'text-yellow-600 bg-yellow-50',
        pending: 'text-gray-600 bg-gray-50',
        in_progress: 'text-blue-600 bg-blue-50',
    };
    return colors[status];
}
export function maskSensitiveData(value, type) {
    if (type === 'email') {
        const [local, domain] = value.split('@');
        return `${local.slice(0, 2)}***@${domain}`;
    }
    if (type === 'phone') {
        return value.slice(-4).padStart(value.length, '*');
    }
    if (type === 'document') {
        return value.slice(-4).padStart(value.length, '*');
    }
    return value;
}
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function validatePhoneNumber(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone);
}
export function calculateSuccessRate(approvedCount, totalCount) {
    if (totalCount === 0)
        return 0;
    return Math.round((approvedCount / totalCount) * 100);
}
export function getVerificationSummary(result) {
    const parts = [];
    if (result.identityVerified) {
        parts.push('✓ Identity verified');
    }
    else {
        parts.push('✗ Identity not verified');
    }
    parts.push(`Risk level: ${result.riskLevel.toUpperCase()}`);
    if (result.documentationStatus === 'complete') {
        parts.push('✓ Documentation complete');
    }
    else {
        parts.push(`⚠ Documentation ${result.documentationStatus}`);
    }
    return parts.join(' • ');
}
export function generateRequestId() {
    return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''));
    return JSON.parse(jsonPayload);
}
export function sanitizeData(data) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            // Remove potentially malicious content
            sanitized[key] = value.replace(/<[^>]*>/g, '').trim();
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
//# sourceMappingURL=helpers.js.map