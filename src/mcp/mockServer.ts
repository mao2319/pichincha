// Mock MCP Server Implementation for Local Development

export interface VerifyIdentityResult {
  verified: boolean
  confidence: number
  requiresEscalation: boolean
  details: {
    documentValidity: boolean
    ageVerified: boolean
    consistencyScore: number
  }
}

export interface CheckRiskListsResult {
  risk_level: 'low' | 'medium' | 'high'
  matches: string[]
  requiresEscalation: boolean
  details: {
    pep_match: boolean
    ofac_match: boolean
    aml_score: number
  }
}

export interface PrepareDocumentationResult {
  required_documents: string[]
  additional_documents?: string[]
  deadline: string
  product_specific: Record<string, unknown>
}

export const mockMcpServer = {
  // Tool 1: Verify Identity
  async verify_identity(
    _documentId: string
  ): Promise<VerifyIdentityResult> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock logic: some documents have lower confidence
    const confidence = Math.random()
    const verified = confidence > 0.6

    return {
      verified,
      confidence: parseFloat(confidence.toFixed(2)),
      requiresEscalation: confidence < 0.8,
      details: {
        documentValidity: verified,
        ageVerified: verified && Math.random() > 0.2,
        consistencyScore: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)),
      },
    }
  },

  // Tool 2: Check Risk Lists
  async check_risk_lists(
    name: string,
    _documentId: string
  ): Promise<CheckRiskListsResult> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock logic: determine risk level based on name patterns
    const riskValue = Math.random()
    let risk_level: 'low' | 'medium' | 'high'
    let aml_score: number

    if (riskValue < 0.6) {
      risk_level = 'low'
      aml_score = Math.random() * 30
    } else if (riskValue < 0.9) {
      risk_level = 'medium'
      aml_score = 30 + Math.random() * 40
    } else {
      risk_level = 'high'
      aml_score = 70 + Math.random() * 30
    }

    // Mock matches (some people may have suspicious names)
    const matches: string[] = []
    if (name.toLowerCase().includes('test')) {
      matches.push('Matches test blacklist')
    }
    if (Math.random() < 0.1) {
      matches.push('Potential PEP connection')
    }

    return {
      risk_level,
      matches,
      requiresEscalation: risk_level === 'high',
      details: {
        pep_match: matches.some((m) => m.includes('PEP')),
        ofac_match: matches.some((m) => m.includes('OFAC')),
        aml_score: parseFloat(aml_score.toFixed(2)),
      },
    }
  },

  // Tool 3: Prepare Documentation
  async prepare_documentation(
    product: string,
    _clientData?: any
  ): Promise<PrepareDocumentationResult> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    // Base required documents
    const required_documents = [
      'Valid ID (Passport or National ID)',
      'Proof of Address (Utility Bill)',
      'Income Verification (Pay Stub or Tax Return)',
    ]

    // Product-specific documents
    let additional_documents: string[] = []
    let product_specific: Record<string, unknown> = {}

    switch (product.toLowerCase()) {
      case 'cuenta_ahorros':
        additional_documents = ['Initial deposit proof']
        product_specific = {
          minimum_deposit: 100,
          account_type: 'savings',
          features: ['interest bearing', 'online access'],
        }
        break

      case 'credito':
        additional_documents = [
          'Credit authorization',
          'Bank statements (6 months)',
        ]
        product_specific = {
          max_amount: 50000,
          product_type: 'credit_line',
          requirements: ['good credit score', '6 months income history'],
        }
        break

      case 'tarjeta_credito':
        additional_documents = ['Credit card authorization']
        product_specific = {
          limit: 5000,
          product_type: 'credit_card',
          features: ['cashback', 'rewards program'],
        }
        break

      case 'inversion':
        additional_documents = [
          'Investment agreement',
          'Risk acknowledgment',
        ]
        product_specific = {
          min_investment: 1000,
          product_type: 'investment',
          risk_profile: 'medium',
        }
        break

      default:
        additional_documents = []
        product_specific = { product_type: 'generic' }
    }

    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 7) // 7 days to submit

    return {
      required_documents,
      additional_documents,
      deadline: deadline.toISOString().split('T')[0],
      product_specific,
    }
  },

  // Batch call all verification tools
  async verifyAll(
    prospectName: string,
    documentId: string,
    product: string
  ) {
    const [identity, risk, documentation] = await Promise.all([
      this.verify_identity(documentId),
      this.check_risk_lists(prospectName, documentId),
      this.prepare_documentation(product, {}),
    ])

    return {
      identity,
      risk,
      documentation,
      timestamp: new Date().toISOString(),
      summary: {
        overallStatus:
          identity.requiresEscalation || risk.requiresEscalation
            ? 'escalation_required'
            : identity.verified && risk.risk_level === 'low'
            ? 'approved'
            : 'review_needed',
        requiresEscalation:
          identity.requiresEscalation || risk.requiresEscalation,
        confidenceScore: identity.confidence,
        riskScore: risk.details.aml_score,
      },
    }
  },
}
