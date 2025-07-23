export interface LicenseType {
  id: string
  name: string
  category: string
  regulator: string
  description: string
  processingTime: string
  applicationFee: string
  annualFee: string
  requirements: string[]
  documents: string[]
  applicationSteps: ApplicationStep[]
  contactInfo: ContactInfo
  lastUpdated: string
  difficulty: 'Basic' | 'Intermediate' | 'Advanced'
  isPopular: boolean
}

export interface ApplicationStep {
  step: number
  title: string
  description: string
  estimatedTime: string
  requiredDocuments: string[]
}

export interface ContactInfo {
  department: string
  email: string
  phone: string
  address: string
}

export interface Application {
  id: string
  licenseType: string
  applicantName: string
  companyName: string
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Additional Info Required' | 'Approved' | 'Rejected'
  submissionDate: string
  expectedDecision: string
  progress: number
  nextAction: string
}

export const REGULATORS = ['All', 'Bank of Botswana', 'NBFIRA', 'Financial Intelligence Agency']
export const CATEGORIES = ['All', 'Banking', 'Insurance', 'Asset Management', 'Microfinance', 'Payments', 'Foreign Exchange', 'Compliance']
export const DIFFICULTIES = ['All', 'Basic', 'Intermediate', 'Advanced']

export const mockLicenseTypes: LicenseType[] = [
  {
    id: 'commercial-bank',
    name: 'Commercial Banking License',
    category: 'Banking',
    regulator: 'Bank of Botswana',
    description: 'Full commercial banking license allowing deposit-taking, lending, and comprehensive banking services',
    processingTime: '6-12 months',
    applicationFee: 'P 50,000',
    annualFee: 'P 100,000',
    difficulty: 'Advanced',
    isPopular: true,
    requirements: [
      'Minimum paid-up capital of P40 million',
      'Fit and proper management team',
      'Comprehensive business plan',
      'Risk management framework',
      'Compliance with Basel III standards',
      'Local incorporation requirement'
    ],
    documents: [
      'Certificate of Incorporation',
      'Memorandum and Articles of Association',
      'Business Plan (5-year projection)',
      'Audited Financial Statements',
      'Management CVs and Declarations',
      'Risk Management Policy',
      'Anti-Money Laundering Procedures',
      'IT Systems Documentation'
    ],
    applicationSteps: [
      {
        step: 1,
        title: 'Pre-Application Consultation',
        description: 'Meet with BoB licensing team to discuss requirements',
        estimatedTime: '2-4 weeks',
        requiredDocuments: ['Preliminary Business Plan', 'Shareholder Information']
      },
      {
        step: 2,
        title: 'Formal Application Submission',
        description: 'Submit complete application with all required documents',
        estimatedTime: '1 week',
        requiredDocuments: ['All required documents listed above']
      },
      {
        step: 3,
        title: 'Initial Review and Validation',
        description: 'BoB conducts initial completeness check',
        estimatedTime: '4-6 weeks',
        requiredDocuments: []
      },
      {
        step: 4,
        title: 'Detailed Assessment',
        description: 'Comprehensive review of business model, financials, and compliance',
        estimatedTime: '3-6 months',
        requiredDocuments: ['Additional information as requested']
      },
      {
        step: 5,
        title: 'Final Decision',
        description: 'License approval or rejection with conditions',
        estimatedTime: '2-4 weeks',
        requiredDocuments: []
      }
    ],
    contactInfo: {
      department: 'Banking Supervision Department',
      email: 'licensing@bankofbotswana.bw',
      phone: '+267 360 6000',
      address: 'Private Bag 154, Gaborone, Botswana'
    },
    lastUpdated: '2024-01-15'
  },
  {
    id: 'life-insurance',
    name: 'Life Insurance License',
    category: 'Insurance',
    regulator: 'NBFIRA',
    description: 'License to conduct life insurance business including individual and group life policies',
    processingTime: '4-8 months',
    applicationFee: 'P 25,000',
    annualFee: 'P 50,000',
    difficulty: 'Intermediate',
    isPopular: true,
    requirements: [
      'Minimum paid-up capital of P15 million',
      'Experienced management team',
      'Actuarial expertise',
      'Solvency framework compliance',
      'Local presence requirement'
    ],
    documents: [
      'Certificate of Incorporation',
      'Business Plan with Actuarial Projections',
      'Financial Projections (5 years)',
      'Management Team CVs',
      'Solvency Assessment',
      'Reinsurance Arrangements',
      'Product Designs and Pricing'
    ],
    applicationSteps: [
      {
        step: 1,
        title: 'Pre-Application Phase',
        description: 'Consultation with NBFIRA licensing team',
        estimatedTime: '2-3 weeks',
        requiredDocuments: ['Concept Paper', 'Preliminary Financials']
      },
      {
        step: 2,
        title: 'Application Submission',
        description: 'Submit complete application package',
        estimatedTime: '1 week',
        requiredDocuments: ['Complete application with all supporting documents']
      },
      {
        step: 3,
        title: 'Technical Review',
        description: 'Detailed review by NBFIRA technical teams',
        estimatedTime: '3-5 months',
        requiredDocuments: ['Responses to technical queries']
      },
      {
        step: 4,
        title: 'Final Approval',
        description: 'Board decision and license issuance',
        estimatedTime: '1-2 months',
        requiredDocuments: []
      }
    ],
    contactInfo: {
      department: 'Insurance Supervision',
      email: 'insurance@nbfira.org.bw',
      phone: '+267 391 8734',
      address: 'Plot 54358, CBD, Gaborone'
    },
    lastUpdated: '2024-02-10'
  },
  {
    id: 'microfinance',
    name: 'Microfinance Institution License',
    category: 'Microfinance',
    regulator: 'NBFIRA',
    description: 'License for institutions providing small-scale financial services to underserved populations',
    processingTime: '3-6 months',
    applicationFee: 'P 10,000',
    annualFee: 'P 20,000',
    difficulty: 'Basic',
    isPopular: false,
    requirements: [
      'Minimum paid-up capital of P2 million',
      'Qualified management team',
      'Sound business model',
      'Customer protection measures',
      'Branch network plan'
    ],
    documents: [
      'Certificate of Incorporation',
      'Business Plan',
      'Financial Projections',
      'Management CVs',
      'Customer Protection Policy',
      'Credit Risk Policy',
      'Operations Manual'
    ],
    applicationSteps: [
      {
        step: 1,
        title: 'Application Preparation',
        description: 'Prepare and compile all required documents',
        estimatedTime: '2-4 weeks',
        requiredDocuments: ['All application documents']
      },
      {
        step: 2,
        title: 'Submission and Review',
        description: 'Submit application for regulatory review',
        estimatedTime: '2-4 months',
        requiredDocuments: ['Additional information as requested']
      },
      {
        step: 3,
        title: 'Decision and Approval',
        description: 'Final licensing decision',
        estimatedTime: '1-2 months',
        requiredDocuments: []
      }
    ],
    contactInfo: {
      department: 'Microfinance Supervision',
      email: 'microfinance@nbfira.org.bw',
      phone: '+267 391 8734',
      address: 'Plot 54358, CBD, Gaborone'
    },
    lastUpdated: '2024-01-20'
  },
  {
    id: 'payment-services',
    name: 'Payment Service Provider License',
    category: 'Payments',
    regulator: 'Bank of Botswana',
    description: 'License for electronic payment services, mobile money, and digital financial services',
    processingTime: '4-6 months',
    applicationFee: 'P 15,000',
    annualFee: 'P 30,000',
    difficulty: 'Intermediate',
    isPopular: true,
    requirements: [
      'Minimum paid-up capital of P5 million',
      'Technical infrastructure',
      'Cybersecurity framework',
      'Customer data protection',
      'AML/CFT compliance'
    ],
    documents: [
      'Certificate of Incorporation',
      'Technical Infrastructure Plan',
      'Cybersecurity Assessment',
      'Business Continuity Plan',
      'AML/CFT Procedures',
      'Customer Due Diligence Framework'
    ],
    applicationSteps: [
      {
        step: 1,
        title: 'Pre-Application Consultation',
        description: 'Technical discussions with BoB',
        estimatedTime: '2-3 weeks',
        requiredDocuments: ['Technical Concept Paper']
      },
      {
        step: 2,
        title: 'Application and Technical Review',
        description: 'Comprehensive technical and compliance review',
        estimatedTime: '3-4 months',
        requiredDocuments: ['Complete application package']
      },
      {
        step: 3,
        title: 'Approval and Licensing',
        description: 'Final approval and license issuance',
        estimatedTime: '1-2 months',
        requiredDocuments: []
      }
    ],
    contactInfo: {
      department: 'Financial Services Department',
      email: 'payments@bankofbotswana.bw',
      phone: '+267 360 6000',
      address: 'Private Bag 154, Gaborone, Botswana'
    },
    lastUpdated: '2024-02-05'
  },
  {
    id: 'asset-management',
    name: 'Asset Management License',
    category: 'Asset Management',
    regulator: 'NBFIRA',
    description: 'License to manage collective investment schemes and provide investment advisory services',
    processingTime: '3-5 months',
    applicationFee: 'P 20,000',
    annualFee: 'P 40,000',
    difficulty: 'Intermediate',
    isPopular: false,
    requirements: [
      'Minimum paid-up capital of P5 million',
      'Qualified investment professionals',
      'Investment risk management',
      'Custody arrangements',
      'Client reporting framework'
    ],
    documents: [
      'Certificate of Incorporation',
      'Investment Management Procedures',
      'Risk Management Framework',
      'Custody Agreements',
      'Professional Qualifications',
      'Client Agreement Templates'
    ],
    applicationSteps: [
      {
        step: 1,
        title: 'Application Submission',
        description: 'Submit complete application with all documents',
        estimatedTime: '1 week',
        requiredDocuments: ['All required documents']
      },
      {
        step: 2,
        title: 'Regulatory Review',
        description: 'NBFIRA technical and compliance review',
        estimatedTime: '2-4 months',
        requiredDocuments: ['Clarifications as requested']
      },
      {
        step: 3,
        title: 'Final Decision',
        description: 'Licensing committee decision',
        estimatedTime: '1 month',
        requiredDocuments: []
      }
    ],
    contactInfo: {
      department: 'Capital Markets Supervision',
      email: 'capitalmarkets@nbfira.org.bw',
      phone: '+267 391 8734',
      address: 'Plot 54358, CBD, Gaborone'
    },
    lastUpdated: '2024-01-30'
  }
]

export const mockApplications: Application[] = [
  {
    id: 'APP-2024-001',
    licenseType: 'Payment Service Provider License',
    applicantName: 'John Doe',
    companyName: 'FinTech Solutions Botswana',
    status: 'Under Review',
    submissionDate: '2024-01-15',
    expectedDecision: '2024-04-15',
    progress: 65,
    nextAction: 'Awaiting technical infrastructure assessment'
  },
  {
    id: 'APP-2024-002',
    licenseType: 'Microfinance Institution License',
    applicantName: 'Jane Smith',
    companyName: 'Village Microfinance Ltd',
    status: 'Additional Info Required',
    submissionDate: '2024-01-10',
    expectedDecision: '2024-03-30',
    progress: 45,
    nextAction: 'Submit updated financial projections'
  },
  {
    id: 'APP-2023-045',
    licenseType: 'Life Insurance License',
    applicantName: 'Mike Johnson',
    companyName: 'Botswana Life Assurance',
    status: 'Approved',
    submissionDate: '2023-08-20',
    expectedDecision: '2024-01-20',
    progress: 100,
    nextAction: 'License issued - operational requirements to be met'
  }
]
