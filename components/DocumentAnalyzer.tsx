import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { FileText, Upload, X, Users, Clock, DollarSign, AlertTriangle, FileCheck, TrendingUp, Lightbulb, CheckCircle, Globe, Languages, Target, ShieldCheck, Loader2 } from 'lucide-react';

interface AnalysisResult {
  documentType: {
    category: string;
    subcategory: string;
    confidence: number;
    jurisdiction: string;
  };
  parties: Array<{
    name: string;
    type: 'individual' | 'corporation' | 'government' | 'partnership';
    role: string;
    address?: string;
  }>;
  keyDates: Array<{
    date: string;
    description: string;
    type: 'deadline' | 'effective' | 'expiration' | 'milestone';
    importance: 'critical' | 'high' | 'medium' | 'low';
  }>;
  financialTerms: Array<{
    amount: string;
    currency: string;
    type: 'payment' | 'penalty' | 'deposit' | 'fee';
    frequency?: string;
    conditions?: string;
  }>;
  obligations: Array<{
    party: string;
    obligation: string;
    deadline?: string;
    penalty?: string;
    status: 'pending' | 'completed' | 'overdue';
  }>;
  riskFactors: Array<{
    type: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
    mitigation?: string;
  }>;
  complianceItems: Array<{
    requirement: string;
    status: 'compliant' | 'non-compliant' | 'unclear';
    details: string;
  }>;
  improvements: Array<{
    category: 'Language Clarity' | 'Legal Compliance' | 'Risk Mitigation' | 'Structure' | 'Terms & Conditions';
    priority: 'critical' | 'high' | 'medium' | 'low';
    issue: string;
    suggestion: string;
    impact: string;
    example?: string;
  }>;
  overallScore: {
    clarity: number;
    completeness: number;
    riskLevel: number;
    compliance: number;
  };
  extractedText: string;
  processedAt: string;
}

interface SharedDocument {
  name: string;
  text: string;
  analysisResults: AnalysisResult;
  timestamp: Date;
}

interface DocumentAnalyzerProps {
  onDocumentAnalyzed: (documentData: SharedDocument) => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳', nativeName: 'বাংলা' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', flag: '🇮🇳', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳', nativeName: 'অসমীয়া' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', nativeName: 'Bahasa Melayu' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', nativeName: 'Suomi' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷', nativeName: 'فارسی' }
];

// Mock analysis function for demo purposes
function generateMockAnalysis(fileName: string, language: string): AnalysisResult {
  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language);
  
  // Generate localized content based on language
  const getLocalizedContent = (lang: string) => {
    const baseContent = {
      category: "Software License Agreement",
      subcategory: "Enterprise SaaS License",
      parties: [
        {
          name: "CloudTech Solutions Inc.",
          role: "Licensor / Software Provider"
        },
        {
          name: "GlobalCorp LLC", 
          role: "Licensee / Enterprise Customer"
        }
      ],
      improvements: [
        {
          category: 'Language Clarity' as const,
          priority: 'high' as const,
          issue: 'Ambiguous termination clause language',
          suggestion: 'Replace vague terms like "reasonable notice" with specific timeframes (e.g., "30 days written notice")',
          impact: 'Reduces potential disputes and provides clear expectations for both parties',
          example: 'Change "reasonable notice" to "thirty (30) calendar days written notice"'
        },
        {
          category: 'Legal Compliance' as const,
          priority: 'critical' as const,
          issue: 'Missing data protection clauses for GDPR compliance',
          suggestion: 'Add comprehensive data processing clauses including purpose limitation, data subject rights, and breach notification procedures',
          impact: 'Ensures compliance with international data protection regulations and avoids potential fines',
          example: 'Include: "Data Controller shall process Personal Data only for purposes specified in Schedule A and in accordance with applicable data protection laws"'
        },
        {
          category: 'Risk Mitigation' as const,
          priority: 'high' as const,
          issue: 'Unlimited liability exposure',
          suggestion: 'Implement liability caps and carve-outs for specific categories (IP infringement, data breaches, gross negligence)',
          impact: 'Limits financial exposure while maintaining accountability for serious breaches',
          example: 'Add: "Total liability shall not exceed 12 months of fees paid, except for IP infringement, data breaches, or gross negligence"'
        }
      ]
    };

    // Localized content for Indian languages
    const localizedContent: { [key: string]: typeof baseContent } = {
      hi: {
        ...baseContent,
        parties: [
          {
            name: "CloudTech Solutions Inc.",
            role: "लाइसेंसर / सॉफ्ट्वेयर प्रदाता"
          },
          {
            name: "GlobalCorp LLC", 
            role: "लाइसेंसधारी / उद्यम ग्राहक"
          }
        ],
        improvements: [
          {
            category: 'Language Clarity' as const,
            priority: 'high' as const,
            issue: 'अस्पष्ट समाप्ति खंड भाषा',
            suggestion: '"उचित सूचना" जैसे अस्पष्ट शब्दों को विशिष्ट समयसीमा के साथ बदलें',
            impact: 'संभावित विवादों को कम करता है और स्पष्ट अपेक्षाएं प्रदान करता है',
            example: '"उचित सूचना" को "तीस (30) कैलेंडर दिन लिखित सूचना" में बदलें'
          },
          {
            category: 'Legal Compliance' as const,
            priority: 'critical' as const,
            issue: 'GDPR अनुपालन के लिए डेटा सुरक्षा खंड गायब',
            suggestion: 'डेटा प्रसंस्करण खंड जोड़ें जिसमें उद्देश्य सीमा और विषय अधिकार शामिल हों',
            impact: 'नियामक अनुपालन सुनिश्चित करता है और जुर्माने से बचाता है'
          },
          {
            category: 'Risk Mitigation' as const,
            priority: 'high' as const,
            issue: 'असीमित दायित्व जोखिम',
            suggestion: 'दायित्व सीमा और विशिष्ट श्रेणियों के लिए कार्व-आउट लागू करें',
            impact: 'वित्तीय जोखिम को सीमित करता है'
          }
        ]
      },
      te: {
        ...baseContent,
        parties: [
          {
            name: "CloudTech Solutions Inc.",
            role: "లైసెన్సర్ / సాఫ్ట్‌వేర్ ప్రొవైడర్"
          },
          {
            name: "GlobalCorp LLC", 
            role: "లైసెన్సీ / ఎంటర్‌ప్రైజ్ కస్టమర్"
          }
        ]
      }
    };

    return localizedContent[lang] || baseContent;
  };

  const content = getLocalizedContent(language);

  return {
    documentType: {
      category: content.category,
      subcategory: content.subcategory,
      confidence: 94.2,
      jurisdiction: language === 'hi' ? "डेलावेयर राज्य, यूएसए" :
                   language === 'te' ? "డెలావేర్ రాష్ట్రం, USA" :
                   language === 'ta' ? "டெலாவேர் மாநிலம், USA" :
                   "State of Delaware, USA"
    },
    parties: content.parties.map((party, index) => ({
      name: party.name,
      type: "corporation" as const,
      role: party.role,
      address: index === 0 ? "1234 Innovation Drive, San Francisco, CA 94105" : "5678 Business Plaza, New York, NY 10001"
    })),
    keyDates: [
      {
        date: "2024-02-01",
        description: language === 'hi' ? "अनुबंध प्रभावी तिथि" : 
                    language === 'te' ? "కాంట్రాక్ట్ ఎఫెక్టివ్ డేట్" : 
                    "Contract Effective Date",
        type: "effective",
        importance: "critical"
      },
      {
        date: "2029-02-01", 
        description: language === 'hi' ? "अनुबंध समाप्ति तिथि" : 
                    language === 'te' ? "కాంట్రాక్ట్ ఎక్స్‌పైరేషన్ డేట్" : 
                    "Contract Expiration Date",
        type: "expiration",
        importance: "critical"
      }
    ],
    financialTerms: [
      {
        amount: "75000",
        currency: "USD", 
        type: "fee",
        frequency: language === 'hi' ? "वार्षिक" : 
                  language === 'te' ? "వార్షిక" : 
                  "Annual",
        conditions: language === 'hi' ? "आधार लाइसेंस शुल्क" : 
                   language === 'te' ? "బేస్ లైసెన్స్ ఫీ" : 
                   "Base License Fee"
      }
    ],
    obligations: [
      {
        party: "CloudTech Solutions Inc.",
        obligation: language === 'hi' ? "99.5% अपटाइम SLA बनाए रखना" : 
                   language === 'te' ? "99.5% అప్‌టైమ్ SLA నిర్వహించడం" : 
                   "Maintain 99.5% uptime SLA",
        deadline: "Ongoing",
        status: "pending"
      }
    ],
    riskFactors: [
      {
        type: "high",
        description: language === 'hi' ? "असममित समाप्ति अधिकार" : 
                    language === 'te' ? "అసిమెట్రిక్ టెర్మినేషన్ రైట్స్" : 
                    "Asymmetric termination rights",
        impact: language === 'hi' ? "लाइसेंसधारी के लिए परिचालन जोखिम" : 
               language === 'te' ? "లైసెన్సీకి ఆపరేషనల్ రిస్క్" : 
               "Operational risk for licensee"
      }
    ],
    complianceItems: [
      {
        requirement: "GDPR Data Protection",
        status: "non-compliant",
        details: language === 'hi' ? "डेटा प्रसंस्करण खंड अनुपस्थित" : 
                language === 'te' ? "డేటా ప్రాసెసింగ్ క్లాజులు లేవు" : 
                "Missing data processing clauses"
      }
    ],
    improvements: content.improvements,
    overallScore: {
      clarity: Math.floor(Math.random() * 20) + 70,
      completeness: Math.floor(Math.random() * 15) + 80,
      riskLevel: Math.floor(Math.random() * 25) + 60,
      compliance: Math.floor(Math.random() * 30) + 55
    },
    extractedText: `Sample extracted text from ${fileName}. This would contain the actual document content in a real implementation.`,
    processedAt: new Date().toISOString()
  };
}

export function DocumentAnalyzer({ onDocumentAnalyzed }: DocumentAnalyzerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [analysisLanguage, setAnalysisLanguage] = useState<string>('en');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.toLowerCase().match(/\.(txt|pdf|docx|doc)$/)) {
        setError('Please upload a valid document file (PDF, DOC, DOCX, or TXT)');
        return;
      }
      
      // Validate file size (50MB limit)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleCancelFile = () => {
    setFile(null);
    setResults(null);
    setError(null);
    // Reset the file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const analyzeDocument = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);
    
    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Generate mock analysis results
      const analysisResult = generateMockAnalysis(file.name, analysisLanguage);
      setResults(analysisResult);
      
      // Share document with summarizer
      const documentData: SharedDocument = {
        name: file.name,
        text: analysisResult.extractedText,
        analysisResults: analysisResult,
        timestamp: new Date()
      };
      onDocumentAnalyzed(documentData);
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze document');
    } finally {
      setAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Language Clarity': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Legal Compliance': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Risk Mitigation': return 'bg-red-100 text-red-800 border-red-200';
      case 'Structure': return 'bg-green-100 text-green-800 border-green-200';
      case 'Terms & Conditions': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <FileText className="h-5 w-5 text-slate-600" />
            AI-Powered Legal Document Analyzer
          </CardTitle>
          <CardDescription className="text-slate-600">
            Upload legal documents for comprehensive AI analysis with multilingual support and detailed improvement suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Document Upload */}
          <div className="space-y-3">
            <Label htmlFor="file-upload" className="text-slate-700">Upload Legal Document</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <div className="space-y-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="max-w-xs mx-auto bg-white border-slate-300"
                  disabled={analyzing}
                />
                <p className="text-sm text-slate-500">
                  Supports PDF, DOC, DOCX, and TXT files (max 50MB)
                </p>
                <p className="text-xs text-slate-400">
                  Your documents are processed securely using advanced AI analysis
                </p>
              </div>
            </div>
            {file && (
              <div className="flex items-center justify-between p-4 bg-slate-100 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-600" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800">{file.name}</span>
                    <span className="text-sm text-slate-500">{formatFileSize(file.size)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    Ready for analysis
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelFile}
                    className="h-8 w-8 p-0 border-slate-300 hover:bg-red-50 hover:border-red-300"
                    disabled={analyzing}
                  >
                    <X className="h-4 w-4 text-slate-600 hover:text-red-600" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Language Selection */}
          <div className="space-y-3">
            <Label htmlFor="analysis-language" className="text-slate-700 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Analysis Language
            </Label>
            <Select value={analysisLanguage} onValueChange={setAnalysisLanguage} disabled={analyzing}>
              <SelectTrigger className="bg-white border-slate-300">
                <SelectValue placeholder="Select analysis language" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 max-h-60">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      <span className="text-sm text-slate-500">({lang.nativeName})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Analyze Button */}
          <Button 
            onClick={analyzeDocument} 
            disabled={!file || analyzing}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white"
          >
            {analyzing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Document...
              </div>
            ) : (
              'Analyze Document with AI'
            )}
          </Button>

          {/* Progress */}
          {analyzing && (
            <div className="space-y-3">
              <Progress value={analysisProgress} className="w-full h-2" />
              <p className="text-sm text-slate-600 text-center">
                {analysisProgress < 30 ? 'Extracting text from document...' :
                 analysisProgress < 60 ? 'Analyzing document structure...' :
                 analysisProgress < 90 ? `Generating insights in ${SUPPORTED_LANGUAGES.find(l => l.code === analysisLanguage)?.name}...` :
                 'Finalizing analysis...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Document Overview */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <FileCheck className="h-5 w-5 text-slate-600" />
                Document Analysis Results
              </CardTitle>
              <CardDescription className="text-slate-600">
                Comprehensive AI analysis completed in {SUPPORTED_LANGUAGES.find(l => l.code === analysisLanguage)?.name} ({SUPPORTED_LANGUAGES.find(l => l.code === analysisLanguage)?.nativeName})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-1">
                  <Label className="text-sm text-slate-700">Document Type</Label>
                  <p className="font-medium text-slate-800">{results.documentType.category}</p>
                  <p className="text-sm text-slate-600">{results.documentType.subcategory}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-700">AI Confidence</Label>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {results.documentType.confidence}%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-700">Jurisdiction</Label>
                  <p className="text-sm text-slate-600">{results.documentType.jurisdiction}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-700">Processed</Label>
                  <p className="text-sm text-slate-600">
                    {new Date(results.processedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <Separator className="my-4 bg-slate-200" />
              
              {/* Overall Scores */}
              <div className="space-y-3">
                <Label className="text-sm text-slate-700">Overall Assessment Scores</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Clarity</span>
                      <span>{results.overallScore.clarity}%</span>
                    </div>
                    <Progress value={results.overallScore.clarity} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completeness</span>
                      <span>{results.overallScore.completeness}%</span>
                    </div>
                    <Progress value={results.overallScore.completeness} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Risk Level</span>
                      <span>{results.overallScore.riskLevel}%</span>
                    </div>
                    <Progress value={results.overallScore.riskLevel} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Compliance</span>
                      <span>{results.overallScore.compliance}%</span>
                    </div>
                    <Progress value={results.overallScore.compliance} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Improvement Suggestions */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                AI-Generated Improvement Suggestions
              </CardTitle>
              <CardDescription className="text-slate-600">
                Intelligent recommendations to enhance your legal document's effectiveness and compliance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.improvements.map((improvement, index) => (
                <Card key={index} className="border-l-4 border-l-yellow-500 bg-white/50 border-slate-200">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(improvement.category)}>
                            {improvement.category}
                          </Badge>
                          <Badge className={getPriorityColor(improvement.priority)}>
                            {improvement.priority} priority
                          </Badge>
                        </div>
                        <Target className="h-4 w-4 text-slate-500" />
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <Label className="text-sm text-slate-700 font-medium">Issue Identified:</Label>
                          <p className="text-sm text-slate-600 mt-1">{improvement.issue}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-slate-700 font-medium">AI Recommendation:</Label>
                          <p className="text-sm text-slate-600 mt-1">{improvement.suggestion}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-slate-700 font-medium">Expected Impact:</Label>
                          <p className="text-sm text-slate-600 mt-1">{improvement.impact}</p>
                        </div>
                        
                        {improvement.example && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <Label className="text-sm text-blue-800 font-medium">Example Implementation:</Label>
                            <p className="text-sm text-blue-700 mt-1 font-mono">{improvement.example}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Parties Section */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Users className="h-5 w-5 text-slate-600" />
                Identified Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.parties.map((party, index) => (
                <div key={index} className="border border-slate-200 rounded-xl p-4 space-y-2 bg-white/50">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-slate-300">{party.type}</Badge>
                    <h4 className="font-medium text-slate-800">{party.name}</h4>
                  </div>
                  <p className="text-sm text-slate-600">{party.role}</p>
                  {party.address && (
                    <p className="text-sm text-slate-500">{party.address}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Key Dates and Financial Terms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Clock className="h-5 w-5 text-slate-600" />
                  Critical Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.keyDates.map((date, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white/50">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-800">{date.description}</p>
                      <p className="text-sm text-slate-600">{date.date}</p>
                    </div>
                    <Badge className={date.importance === 'critical' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                      {date.importance}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <DollarSign className="h-5 w-5 text-slate-600" />
                  Financial Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.financialTerms.map((term, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white/50">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-800">{term.conditions}</p>
                      <p className="text-sm text-slate-600">{term.frequency}</p>
                    </div>
                    <span className="font-semibold text-lg text-slate-800">{term.currency} {term.amount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Risk Factors */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                AI Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.riskFactors.map((risk, index) => (
                <Alert key={index} className="border-l-4 border-l-red-500 bg-white/50">
                  <AlertTriangle className="h-4 w-4" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-800">{risk.description}</h4>
                      <Badge className={risk.type === 'high' ? 'bg-red-100 text-red-800 border-red-200' : risk.type === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-green-100 text-green-800 border-green-200'}>
                        {risk.type} risk
                      </Badge>
                    </div>
                    <AlertDescription className="text-slate-600">
                      <p><strong>Impact:</strong> {risk.impact}</p>
                      {risk.mitigation && <p><strong>Mitigation:</strong> {risk.mitigation}</p>}
                    </AlertDescription>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>

          {/* Share with Summarizer */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Document analyzed successfully!</p>
                    <p className="text-sm text-blue-600">AI analysis complete. You can now use this document in the Document Summarizer for detailed summaries.</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  Ready to share
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}