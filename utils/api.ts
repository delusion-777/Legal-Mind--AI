// API utility functions for LegalMind AI

// Safe environment variable access with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  // Check if we're in a browser environment and have access to import.meta
  if (typeof window !== 'undefined' && typeof import !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  
  // Fallback for environments without proper env setup
  return fallback;
};

const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL', 'https://demo-project.supabase.co');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY', 'demo-anon-key');

// Check if we're in demo mode (no real backend configured)
const IS_DEMO_MODE = SUPABASE_URL === 'https://demo-project.supabase.co' || SUPABASE_ANON_KEY === 'demo-anon-key';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DocumentAnalysisRequest {
  file: File;
  language: string;
  analysisType?: 'full' | 'summary' | 'audio';
  userId?: string;
}

export interface DocumentSummarizationRequest {
  text: string;
  language: string;
  summaryType: string;
  userId?: string;
}

export interface AudioConversionRequest {
  file: File;
  language: string;
  voiceType: string;
  summaryLength?: string;
  includeGlossary?: boolean;
  simplifyLanguage?: boolean;
  extractConcepts?: boolean;
  userId?: string;
}

// Mock data generators for demo mode
function generateMockDocumentAnalysis(fileName: string, language: string): any {
  return {
    documentType: {
      category: "Software License Agreement",
      subcategory: "Enterprise SaaS License",
      confidence: 94.2,
      jurisdiction: "State of Delaware, USA"
    },
    parties: [
      {
        name: "CloudTech Solutions Inc.",
        type: "corporation",
        role: "Licensor / Software Provider",
        address: "1234 Innovation Drive, San Francisco, CA 94105"
      },
      {
        name: "GlobalCorp LLC",
        type: "corporation", 
        role: "Licensee / Enterprise Customer",
        address: "5678 Business Plaza, New York, NY 10001"
      }
    ],
    keyDates: [
      {
        date: "2024-02-01",
        description: "Contract Effective Date",
        type: "effective",
        importance: "critical"
      },
      {
        date: "2029-02-01",
        description: "Contract Expiration Date", 
        type: "expiration",
        importance: "critical"
      }
    ],
    financialTerms: [
      {
        amount: "75000",
        currency: "USD",
        type: "fee",
        frequency: "Annual",
        conditions: "Base License Fee"
      }
    ],
    obligations: [
      {
        party: "CloudTech Solutions Inc.",
        obligation: "Maintain 99.5% uptime SLA",
        deadline: "Ongoing",
        status: "pending"
      }
    ],
    riskFactors: [
      {
        type: "high",
        description: "Asymmetric termination rights",
        impact: "Operational risk for licensee"
      }
    ],
    complianceItems: [
      {
        requirement: "GDPR Data Protection",
        status: "non-compliant", 
        details: "Missing data processing clauses"
      }
    ],
    improvements: [
      {
        category: "Language Clarity",
        priority: "high",
        issue: "Ambiguous termination clause language",
        suggestion: "Replace vague terms with specific timeframes",
        impact: "Reduces potential disputes and provides clear expectations",
        example: "Change 'reasonable notice' to 'thirty (30) calendar days written notice'"
      },
      {
        category: "Legal Compliance", 
        priority: "critical",
        issue: "Missing data protection clauses",
        suggestion: "Add comprehensive GDPR compliance provisions",
        impact: "Ensures regulatory compliance and avoids potential fines"
      }
    ],
    overallScore: {
      clarity: 72,
      completeness: 85,
      riskLevel: 68,
      compliance: 61
    },
    extractedText: `Sample extracted text from ${fileName}. This demonstrates the document analysis capabilities.`,
    processedAt: new Date().toISOString()
  };
}

function generateMockSummary(text: string, language: string): any {
  return {
    executiveSummary: "This is a comprehensive software licensing agreement with identified areas for improvement in clarity and compliance.",
    keyPoints: [
      "5-year exclusive enterprise software licensing agreement",
      "Tiered pricing model with base fee and per-user charges", 
      "99.5% uptime SLA requirement",
      "Automatic renewal clause present",
      "Delaware jurisdiction and governing law"
    ],
    documentInfo: {
      type: "Software License Agreement",
      language: language,
      wordCount: text.length,
      complexity: "high"
    }
  };
}

function generateMockAudioConversion(fileName: string, language: string): any {
  return {
    originalDuration: fileName.toLowerCase().includes('audio') ? "3h 42m" : "N/A (Document)",
    summaryDuration: "22m 15s",
    compressionRatio: fileName.toLowerCase().includes('audio') ? "10:1" : "N/A",
    inputType: fileName.toLowerCase().includes('audio') ? 'audio' : 'document',
    transcriptionAccuracy: 96.8,
    outputLanguage: language,
    audioUrl: `/generated-audio/${Date.now()}.mp3`,
    processedAt: new Date().toISOString()
  };
}

// Base API call function with error handling and demo mode support
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  
  // If in demo mode, return mock data
  if (IS_DEMO_MODE) {
    console.log(`Demo mode: Simulating API call to ${endpoint}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Return appropriate mock data based on endpoint
    if (endpoint === '/analyze-document') {
      return {
        success: true,
        data: generateMockDocumentAnalysis('demo-file.pdf', 'en') as T
      };
    } else if (endpoint === '/summarize-document') {
      return {
        success: true,
        data: generateMockSummary('demo text', 'en') as T
      };
    } else if (endpoint === '/convert-to-audio') {
      return {
        success: true,
        data: generateMockAudioConversion('demo-file.pdf', 'en') as T
      };
    } else if (endpoint === '/health') {
      return {
        success: true,
        data: {
          status: 'healthy (demo mode)',
          timestamp: new Date().toISOString(),
          version: '1.0.0-demo'
        } as T
      };
    }
    
    return {
      success: false,
      error: 'Demo mode: Endpoint not implemented'
    };
  }

  // Real API call logic for production
  try {
    const url = `${SUPABASE_URL}/functions/v1/server${endpoint}`;
    
    const defaultHeaders = {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Document Analysis API
export async function analyzeDocument(request: DocumentAnalysisRequest): Promise<ApiResponse<any>> {
  if (IS_DEMO_MODE) {
    // In demo mode, generate mock data based on request
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
    
    return {
      success: true,
      data: generateMockDocumentAnalysis(request.file.name, request.language)
    };
  }

  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('language', request.language);
  formData.append('analysisType', request.analysisType || 'full');
  
  if (request.userId) {
    formData.append('userId', request.userId);
  }

  return apiCall('/analyze-document', {
    method: 'POST',
    body: formData,
  });
}

// Document Summarization API
export async function summarizeDocument(request: DocumentSummarizationRequest): Promise<ApiResponse<any>> {
  if (IS_DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      data: generateMockSummary(request.text, request.language)
    };
  }

  return apiCall('/summarize-document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: request.text,
      language: request.language,
      summaryType: request.summaryType,
      userId: request.userId,
    }),
  });
}

// Audio Conversion API
export async function convertToAudio(request: AudioConversionRequest): Promise<ApiResponse<any>> {
  if (IS_DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      success: true,
      data: generateMockAudioConversion(request.file.name, request.language)
    };
  }

  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('language', request.language);
  formData.append('voiceType', request.voiceType);
  
  if (request.summaryLength) formData.append('summaryLength', request.summaryLength);
  if (request.includeGlossary !== undefined) formData.append('includeGlossary', String(request.includeGlossary));
  if (request.simplifyLanguage !== undefined) formData.append('simplifyLanguage', String(request.simplifyLanguage));
  if (request.extractConcepts !== undefined) formData.append('extractConcepts', String(request.extractConcepts));
  if (request.userId) formData.append('userId', request.userId);

  return apiCall('/convert-to-audio', {
    method: 'POST',
    body: formData,
  });
}

// Health Check API
export async function healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; version: string }>> {
  return apiCall('/health', {
    method: 'GET',
  });
}

// User Analytics API
export async function trackUsage(
  actionType: string,
  featureUsed: string,
  languageUsed: string,
  processingTime?: number,
  success: boolean = true,
  errorMessage?: string,
  metadata?: Record<string, any>
): Promise<ApiResponse<any>> {
  if (IS_DEMO_MODE) {
    console.log('Demo mode: Usage tracking simulated', {
      actionType,
      featureUsed,
      languageUsed,
      processingTime,
      success
    });
    
    return {
      success: true,
      data: { tracked: true, demo: true }
    };
  }

  return apiCall('/track-usage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      actionType,
      featureUsed,
      languageUsed,
      processingTime,
      success,
      errorMessage,
      metadata,
    }),
  });
}

// Retry mechanism for failed requests
export async function retryApiCall<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  let lastError: string = '';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await apiFunction();
    
    if (result.success) {
      return result;
    }
    
    lastError = result.error || 'Unknown error';
    
    if (attempt < maxRetries) {
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  return {
    success: false,
    error: `Failed after ${maxRetries} attempts. Last error: ${lastError}`
  };
}

// File validation utilities
export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  
  const allowedExtensions = ['.txt', '.pdf', '.docx', '.doc'];
  
  // Check file type
  const hasValidType = allowedTypes.includes(file.type);
  const hasValidExtension = allowedExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidType && !hasValidExtension) {
    return {
      valid: false,
      error: 'Please upload a valid document file (PDF, DOC, DOCX, or TXT)'
    };
  }
  
  // Check file size (50MB limit)
  if (file.size > 50 * 1024 * 1024) {
    return {
      valid: false,
      error: 'File size must be less than 50MB'
    };
  }
  
  // Check if file is empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File appears to be empty'
    };
  }
  
  return { valid: true };
}

export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    'audio/mpeg',
    'audio/wav',
    'audio/m4a',
    'audio/ogg',
    'audio/flac',
    'audio/mp3',
    'audio/x-wav'
  ];
  
  const allowedExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac'];
  
  // Check file type
  const hasValidType = allowedTypes.includes(file.type);
  const hasValidExtension = allowedExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidType && !hasValidExtension) {
    return {
      valid: false,
      error: 'Please upload a valid audio file (MP3, WAV, M4A, OGG, or FLAC)'
    };
  }
  
  // Check file size (1GB limit for audio)
  if (file.size > 1024 * 1024 * 1024) {
    return {
      valid: false,
      error: 'Audio file size must be less than 1GB'
    };
  }
  
  // Check if file is empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'Audio file appears to be empty'
    };
  }
  
  return { valid: true };
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Calculate processing time
export function calculateProcessingTime(startTime: number): number {
  return Date.now() - startTime;
}

// Rate limiting utilities
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(userId: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(userId);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userRequests.count >= maxRequests) {
    return false;
  }
  
  userRequests.count += 1;
  return true;
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

// Network status check
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// Environment check
export function isProduction(): boolean {
  return typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.PROD;
}

// Demo mode check
export function isDemoMode(): boolean {
  return IS_DEMO_MODE;
}

// API configuration validation
export function validateApiConfig(): { valid: boolean; errors: string[]; demo: boolean } {
  const errors: string[] = [];
  
  if (IS_DEMO_MODE) {
    return {
      valid: true,
      errors: [],
      demo: true
    };
  }
  
  if (!SUPABASE_URL || SUPABASE_URL === 'https://demo-project.supabase.co') {
    errors.push('VITE_SUPABASE_URL environment variable is not configured');
  }
  
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'demo-anon-key') {
    errors.push('VITE_SUPABASE_ANON_KEY environment variable is not configured');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    demo: false
  };
}