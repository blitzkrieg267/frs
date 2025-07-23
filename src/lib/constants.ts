import { RegulatoryRequirement } from "@/types/requirements"

export const USER_ROLES = {
  PUBLIC: {
    name: 'Public User',
    permissions: ['view_public_documents', 'search_documents'],
    description: 'Access to publicly available regulatory documents'
  },
  PROFESSIONAL: {
    name: 'Financial Professional',
    permissions: ['view_public_documents', 'view_professional_documents', 'search_documents', 'download_forms'],
    description: 'Enhanced access for licensed financial professionals'
  },
  INSTITUTIONAL: {
    name: 'Institutional User',
    permissions: ['view_all_documents', 'search_documents', 'download_forms', 'submit_applications', 'track_applications'],
    description: 'Full access for financial institutions and regulated entities'
  },
  REGULATOR: {
    name: 'Regulatory Staff',
    permissions: ['admin_access', 'manage_documents', 'view_analytics', 'approve_applications'],
    description: 'Administrative access for regulatory body staff'
  }
}

export const ENTITY_TYPES = [
  'All Financial Institutions',
  'Commercial Bank',
  'Insurance Company',
  'Asset Management Firm',
  'Microfinance Institution',
  'Payment Service Provider',
  'Bureau de Change',
  'Investment Advisor',
  'Pension Fund',
  'Credit Bureau',
  'Other Financial Institution'
]

export const REGULATORY_BODIES = [
  'Bank of Botswana',
  'NBFIRA',
  'Financial Intelligence Agency',
  'Other'
]


export const mockRequirements: RegulatoryRequirement[] = [
  {
    id: 'req-001',
    title: 'Minimum Capital Requirements',
    category: 'Capital & Solvency',
    regulator: 'Bank of Botswana',
    entityType: ['Commercial Bank', 'Investment Bank'],
    priority: 'Critical',
    description: 'Banks must maintain minimum capital adequacy ratios as prescribed by Basel III standards',
    specificRequirements: [
      'Common Equity Tier 1 ratio of at least 4.5%',
      'Tier 1 capital ratio of at least 6%',
      'Total capital ratio of at least 8%',
      'Capital conservation buffer of 2.5%',
      'Countercyclical buffer as determined by BoB'
    ],
    documents: [
      'Monthly capital adequacy returns',
      'Quarterly stress testing reports',
      'Annual ICAAP assessment',
      'Board capital management policy'
    ],
    timeline: 'Monthly reporting required',
    applicableSince: '2019-01-01',
    lastUpdated: '2024-01-15',
    compliance: {
      frequency: 'Monthly',
      deadline: '15th of following month',
      penalties: 'P50,000 - P500,000 plus corrective action'
    },
    references: [
      {
        regulation: 'Banking Act (Cap 46:04)',
        section: 'Section 15A',
        url: 'https://www.bankofbotswana.bw/regulations'
      }
    ],
    tags: ['capital', 'basel', 'ratio', 'tier1', 'mandatory']
  },
  {
    id: 'req-002',
    title: 'Customer Due Diligence (CDD)',
    category: 'AML/CFT Compliance',
    regulator: 'Financial Intelligence Agency',
    entityType: ['All Financial Institutions'],
    priority: 'Critical',
    description: 'All financial institutions must conduct customer due diligence before establishing business relationships',
    specificRequirements: [
      'Identity verification of all customers',
      'Beneficial ownership identification for legal entities',
      'Purpose and nature of business relationship assessment',
      'Ongoing monitoring of business relationships',
      'Enhanced due diligence for high-risk customers'
    ],
    documents: [
      'Customer identification documents',
      'Beneficial ownership registers',
      'Risk assessment documentation',
      'Transaction monitoring records'
    ],
    timeline: 'Before account opening and ongoing',
    applicableSince: '2018-04-01',
    lastUpdated: '2024-02-20',
    compliance: {
      frequency: 'Ongoing',
      deadline: 'Before customer onboarding',
      penalties: 'P100,000 - P2,000,000 or 2 years imprisonment'
    },
    references: [
      {
        regulation: 'Financial Intelligence Act',
        section: 'Section 15',
        url: 'https://www.fia.org.bw/legislation'
      }
    ],
    tags: ['cdd', 'kyc', 'aml', 'identity', 'verification']
  },
  {
    id: 'req-003',
    title: 'Solvency Margin Requirements',
    category: 'Capital & Solvency',
    regulator: 'NBFIRA',
    entityType: ['Life Insurance', 'General Insurance'],
    priority: 'Critical',
    description: 'Insurance companies must maintain adequate solvency margins to protect policyholders',
    specificRequirements: [
      'Minimum solvency margin of 150% of required capital',
      'Risk-based capital calculation methodology',
      'Regular actuarial valuation of liabilities',
      'Investment portfolio stress testing',
      'Concentration risk limits'
    ],
    documents: [
      'Quarterly solvency returns',
      'Annual actuarial reports',
      'Investment portfolio statements',
      'Risk management reports'
    ],
    timeline: 'Quarterly reporting',
    applicableSince: '2020-01-01',
    lastUpdated: '2024-01-30',
    compliance: {
      frequency: 'Quarterly',
      deadline: '30 days after quarter end',
      penalties: 'Restriction of business activities and fines'
    },
    references: [
      {
        regulation: 'Insurance Industry Act',
        section: 'Section 45',
        url: 'https://www.nbfira.org.bw/regulations'
      }
    ],
    tags: ['solvency', 'margin', 'insurance', 'capital', 'actuarial']
  },
  {
    id: 'req-004',
    title: 'Liquidity Coverage Ratio (LCR)',
    category: 'Liquidity Management',
    regulator: 'Bank of Botswana',
    entityType: ['Commercial Bank'],
    priority: 'High',
    description: 'Banks must maintain sufficient high-quality liquid assets to survive acute stress scenarios',
    specificRequirements: [
      'LCR of at least 100% at all times',
      'High-Quality Liquid Assets (HQLA) calculation',
      'Net cash outflow estimation over 30-day period',
      'Daily monitoring and reporting',
      'Contingency funding plan maintenance'
    ],
    documents: [
      'Daily LCR calculations',
      'Monthly LCR reports to BoB',
      'HQLA portfolio statements',
      'Liquidity stress test results'
    ],
    timeline: 'Daily monitoring, monthly reporting',
    applicableSince: '2020-06-01',
    lastUpdated: '2023-12-15',
    compliance: {
      frequency: 'Monthly',
      deadline: '15th of following month',
      penalties: 'Corrective action plan and supervision'
    },
    references: [
      {
        regulation: 'Banking Regulations',
        section: 'Regulation 15B',
        url: 'https://www.bankofbotswana.bw/liquidity'
      }
    ],
    tags: ['liquidity', 'lcr', 'hqla', 'stress', 'funding']
  },
  {
    id: 'req-005',
    title: 'Corporate Governance Framework',
    category: 'Governance & Management',
    regulator: 'NBFIRA',
    entityType: ['All NBFIRA Entities'],
    priority: 'High',
    description: 'All regulated entities must establish and maintain effective corporate governance frameworks',
    specificRequirements: [
      'Board composition with independent directors',
      'Board committees (Audit, Risk, Remuneration)',
      'CEO and senior management fit and proper assessments',
      'Internal audit function establishment',
      'Risk management framework implementation'
    ],
    documents: [
      'Board charter and committee terms of reference',
      'Directors\' declarations of interests',
      'Internal audit reports',
      'Risk management policies',
      'Governance compliance certificates'
    ],
    timeline: 'Annual assessment and reporting',
    applicableSince: '2019-07-01',
    lastUpdated: '2024-01-10',
    compliance: {
      frequency: 'Annual',
      deadline: 'Within 6 months of financial year end',
      penalties: 'Director disqualification and fines'
    },
    references: [
      {
        regulation: 'Corporate Governance Guidelines',
        section: 'All Sections',
        url: 'https://www.nbfira.org.bw/governance'
      }
    ],
    tags: ['governance', 'board', 'directors', 'audit', 'risk']
  },
  {
    id: 'req-006',
    title: 'Microfinance Interest Rate Caps',
    category: 'Product Regulation',
    regulator: 'NBFIRA',
    entityType: ['Microfinance Institution'],
    priority: 'Medium',
    description: 'Microfinance institutions must comply with interest rate caps and pricing transparency requirements',
    specificRequirements: [
      'Maximum interest rate of 2.5% per month (30% per annum)',
      'All-in cost disclosure to customers',
      'No hidden fees or charges',
      'Standardized pricing disclosure format',
      'Regular rate review and justification'
    ],
    documents: [
      'Interest rate schedules',
      'Customer loan agreements',
      'Pricing disclosure statements',
      'Rate setting committee minutes'
    ],
    timeline: 'Immediate compliance, quarterly review',
    applicableSince: '2021-03-01',
    lastUpdated: '2023-11-20',
    compliance: {
      frequency: 'Quarterly',
      deadline: 'Ongoing compliance',
      penalties: 'Rate reduction orders and fines'
    },
    references: [
      {
        regulation: 'Microfinance Regulations',
        section: 'Section 12',
        url: 'https://www.nbfira.org.bw/microfinance'
      }
    ],
    tags: ['microfinance', 'interest', 'rates', 'pricing', 'disclosure']
  },
  {
    id: 'req-007',
    title: 'Payment System Security Standards',
    category: 'Technology & Security',
    regulator: 'Bank of Botswana',
    entityType: ['Payment Service Provider', 'Commercial Bank'],
    priority: 'High',
    description: 'Payment service providers must implement robust security measures for electronic payment systems',
    specificRequirements: [
      'PCI DSS compliance for card processing',
      'Multi-factor authentication implementation',
      'Encryption of data in transit and at rest',
      'Regular security penetration testing',
      'Incident response and recovery procedures'
    ],
    documents: [
      'PCI DSS compliance certificates',
      'Security audit reports',
      'Penetration testing results',
      'Incident response procedures',
      'Business continuity plans'
    ],
    timeline: 'Annual certification, ongoing monitoring',
    applicableSince: '2022-01-01',
    lastUpdated: '2024-02-28',
    compliance: {
      frequency: 'Annual',
      deadline: 'Certificate renewal required annually',
      penalties: 'Suspension of payment services'
    },
    references: [
      {
        regulation: 'Payment Systems Guidelines',
        section: 'Section 8',
        url: 'https://www.bankofbotswana.bw/payments'
      }
    ],
    tags: ['payments', 'security', 'pci', 'encryption', 'cyber']
  },
  {
    id: 'req-008',
    title: 'Financial Crime Reporting',
    category: 'AML/CFT Compliance',
    regulator: 'Financial Intelligence Agency',
    entityType: ['All Financial Institutions'],
    priority: 'Critical',
    description: 'Mandatory reporting of suspicious transactions and financial crime indicators',
    specificRequirements: [
      'Suspicious Transaction Reports (STRs) filing',
      'Cash Transaction Reports (CTRs) for amounts >P30,000',
      'Terrorist financing indicators monitoring',
      'Sanctions screening and reporting',
      'Staff training on financial crime detection'
    ],
    documents: [
      'STR/CTR filing records',
      'Sanctions screening logs',
      'Staff training certificates',
      'AML/CFT policies and procedures'
    ],
    timeline: 'Immediate reporting for suspicious activity',
    applicableSince: '2018-04-01',
    lastUpdated: '2024-03-01',
    compliance: {
      frequency: 'Ongoing',
      deadline: 'Within 3 days of detection',
      penalties: 'P500,000 - P5,000,000 and criminal prosecution'
    },
    references: [
      {
        regulation: 'Financial Intelligence Act',
        section: 'Sections 16-18',
        url: 'https://www.fia.org.bw/reporting'
      }
    ],
    tags: ['reporting', 'suspicious', 'crime', 'sanctions', 'terrorism']
  }
]


export const REGULATORS = [
  'Bank of Botswana',
  'NBFIRA',
  'Financial Intelligence Agency'
]

export const CATEGORIES = [
  'Capital & Solvency',
  'AML/CFT Compliance',
  'Liquidity Management',
  'Governance & Management',
  'Product Regulation',
  'Technology & Security',
  'Consumer Protection',
  'Market Conduct',
  'Reporting & Disclosure'
]

export const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']

export const COMPLIANCE_FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annual', 'Ongoing']

