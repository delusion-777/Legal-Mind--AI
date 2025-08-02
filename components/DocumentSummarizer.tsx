import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import { BookOpen, Upload, FileText, Clock, Users, AlertTriangle, CheckCircle, Globe, Languages, Share2, Copy, Download, ExternalLink, Loader2 } from 'lucide-react';

interface SummaryResult {
  executiveSummary: string;
  keyPoints: string[];
  documentInfo: {
    type: string;
    language: string;
    wordCount: number;
    complexity: string;
  };
  detailedAnalysis: {
    parties: string[];
    obligations: string[];
    risks: string[];
    recommendations: string[];
  };
  processedAt: string;
}

interface SharedDocument {
  name: string;
  text: string;
  analysisResults?: any;
  timestamp: Date;
}

interface DocumentSummarizerProps {
  sharedDocument: SharedDocument | null;
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

// Generate localized summary based on language
function generateLocalizedSummary(documentName: string, analysisResults: any, language: string): SummaryResult {
  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language);
  
  const getLocalizedContent = (lang: string) => {
    const baseContent = {
      executiveSummary: `This comprehensive analysis of ${documentName} reveals a Software License Agreement between CloudTech Solutions Inc. and GlobalCorp LLC. The document establishes a 5-year exclusive licensing relationship with annual fees of $75,000. Key risks include ambiguous termination clauses and missing GDPR compliance provisions. The document shows 85% completeness but requires improvements in legal clarity and risk mitigation strategies.`,
      
      keyPoints: [
        "5-year exclusive enterprise software licensing agreement",
        "Annual license fee: $75,000 USD payable in advance",
        "99.5% uptime SLA requirement with service credit provisions",
        "Automatic renewal clause without clear opt-out mechanism",
        "Delaware jurisdiction and governing law specification",
        "Missing comprehensive data protection clauses",
        "Asymmetric termination rights favoring licensor",
        "Limited liability provisions requiring enhancement"
      ],
      
      detailedAnalysis: {
        parties: [
          "CloudTech Solutions Inc. (Delaware Corporation) - Licensor and Software Provider",
          "GlobalCorp LLC (Delaware Limited Liability Company) - Licensee and Enterprise Customer"
        ],
        obligations: [
          "Licensor must maintain 99.5% uptime service level agreement",
          "Licensee must pay annual fees by February 1st each year",
          "Both parties must comply with confidentiality provisions",
          "Licensor must provide technical support during business hours"
        ],
        risks: [
          "Ambiguous termination language could lead to disputes",
          "Missing GDPR clauses create regulatory compliance risk",
          "Unlimited liability exposure for certain breach categories",
          "Automatic renewal without adequate notice provisions"
        ],
        recommendations: [
          "Replace vague termination terms with specific 30-day notice requirements",
          "Add comprehensive GDPR data processing clauses",
          "Implement liability caps not exceeding 12 months of fees",
          "Include force majeure provisions for unforeseen circumstances"
        ]
      }
    };

    // Localized content for Indian languages
    const localizedContent: { [key: string]: typeof baseContent } = {
      hi: {
        executiveSummary: `${documentName} का यह व्यापक विश्लेषण CloudTech Solutions Inc. और GlobalCorp LLC के बीच एक सॉफ्टवेयर लाइसेंस समझौता दर्शाता है। दस्तावेज़ $75,000 की वार्षिक फीस के साथ 5-वर्षीय विशेष लाइसेंसिंग संबंध स्थापित करता है। मुख्य जोखिमों में अस्पष्ट समाप्ति खंड और GDPR अनुपालन प्रावधानों की कमी शामिल है।`,
        
        keyPoints: [
          "5-वर्षीय विशेष उद्यम सॉफ्टवेयर लाइसेंसिंग समझौता",
          "वार्षिक लाइसेंस शुल्क: $75,000 USD अग्रिम देय",
          "99.5% अपटाइम SLA आवश्यकता सेवा क्रेडिट प्रावधानों के साथ",
          "स्पष्ट ऑप्ट-आउट तंत्र के बिना स्वचालित नवीकरण खंड",
          "डेलावेयर क्षेत्राधिकार और शासी कानून निर्दिष्टीकरण"
        ],
        
        detailedAnalysis: {
          parties: [
            "CloudTech Solutions Inc. (डेलावेयर निगम) - लाइसेंसदाता और सॉफ्टवेयर प्रदाता",
            "GlobalCorp LLC (डेलावेयर सीमित देयता कंपनी) - लाइसेंसधारी और उद्यम ग्राहक"
          ],
          obligations: [
            "लाइसेंसदाता को 99.5% अपटाइम सेवा स्तर समझौता बनाए रखना होगा",
            "लाइसेंसधारी को प्रत्येक वर्ष 1 फरवरी तक वार्षिक शुल्क का भुगतान करना होगा",
            "दोनों पक्षों को गोपनीयता प्रावधानों का पालन करना होगा"
          ],
          risks: [
            "अस्पष्ट समाप्ति भाषा विवादों का कारण बन सकती है",
            "GDPR खंडों की कमी नियामक अनुपालन जोखिम पैदा करती है",
            "कुछ उल्लंघन श्रेणियों के लिए असीमित देयता जोखिम"
          ],
          recommendations: [
            "अस्पष्ट समाप्ति शर्तों को विशिष्ट 30-दिन नोटिस आवश्यकताओं से बदलें",
            "व्यापक GDPR डेटा प्रसंस्करण खंड जोड़ें",
            "12 महीने की फीस से अधिक न होने वाली देयता सीमा लागू करें"
          ]
        }
      },
      
      te: {
        executiveSummary: `${documentName} యొక్క ఈ సమగ్ర విశ్లేషణ CloudTech Solutions Inc. మరియు GlobalCorp LLC మధ్య సాఫ్ట్‌వేర్ లైసెన్స్ ఒప్పందాన్ని వెల్లడిస్తుంది. డాక్యుమెంట్ వార్షిక $75,000 ఫీతో 5-సంవత్సరాల ప్రత్యేక లైసెన్సింగ్ సంబంధాన్ని స్థాపిస్తుంది।`,
        
        keyPoints: [
          "5-సంవత్సరాల ప్రత్యేక వ్యాపార సాఫ్ట్‌వేర్ లైసెన్సింగ్ ఒప్పందం",
          "వార్షిక లైసెన్స్ ఫీ: $75,000 USD ముందుగా చెల్లించాలి",
          "సేవా క్రెడిట్ నిబంధనలతో 99.5% అప్‌టైమ్ SLA అవసరం"
        ],
        
        detailedAnalysis: {
          parties: [
            "CloudTech Solutions Inc. (డెలావేర్ కార్పొరేషన్) - లైసెన్సర్ మరియు సాఫ్ట్‌వేర్ ప్రొవైడర్",
            "GlobalCorp LLC (డెలావేర్ లిమిటెడ్ లయబిలిటీ కంపెనీ) - లైసెన్సీ మరియు వ్యాపార కస్టమర్"
          ],
          obligations: [
            "లైసెన్సర్ 99.5% అప్‌టైమ్ సేవా స్థాయి ఒప్పందాన్ని నిర్వహించాలి",
            "లైసెన్సీ ప్రతి సంవత్సరం ఫిబ్రవరి 1న వార్షిక ఫీలు చెల్లించాలి"
          ],
          risks: [
            "అస్పష్టమైన ముగింపు భాష వివాదాలకు దారితీయవచ్చు",
            "GDPR నిబంధనల లేకపోవడం నియంత్రణ అనుపాలన ప్రమాదాన్ని సృష్టిస్తుంది"
          ],
          recommendations: [
            "అస్పష్టమైన ముగింపు నిబంధనలను నిర్దిష్ట 30-రోజుల నోటీస్ అవసరాలతో మార్చండి",
            "సమగ్ర GDPR డేటా ప్రాసెసింగ్ నిబంధనలను జోడించండి"
          ]
        }
      }
    };

    return localizedContent[lang] || baseContent;
  };

  const content = getLocalizedContent(language);
  
  return {
    ...content,
    documentInfo: {
      type: analysisResults?.documentType?.category || "Legal Document",
      language: selectedLanguage?.name || "English", 
      wordCount: Math.floor(Math.random() * 5000) + 2000,
      complexity: "High"
    },
    processedAt: new Date().toISOString()
  };
}

export function DocumentSummarizer({ sharedDocument }: DocumentSummarizerProps) {
  const [summaryLanguage, setSummaryLanguage] = useState<string>('en');
  const [summaryType, setSummaryType] = useState<string>('comprehensive');
  const [documentText, setDocumentText] = useState<string>('');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryProgress, setSummaryProgress] = useState(0);
  const [results, setResults] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use shared document if available
  React.useEffect(() => {
    if (sharedDocument) {
      setDocumentText(sharedDocument.text);
    }
  }, [sharedDocument]);

  const generateSummary = async () => {
    if (!documentText.trim() && !sharedDocument) {
      setError('Please enter document text or use a document from the analyzer');
      return;
    }
    
    setSummarizing(true);
    setSummaryProgress(0);
    setError(null);
    
    try {
      // Simulate summarization progress
      const progressInterval = setInterval(() => {
        setSummaryProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 600);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setSummaryProgress(100);
      
      // Generate localized summary
      const summaryResult = generateLocalizedSummary(
        sharedDocument?.name || 'Legal Document',
        sharedDocument?.analysisResults,
        summaryLanguage
      );
      
      setResults(summaryResult);
      
    } catch (err) {
      console.error('Summarization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setSummarizing(false);
      setSummaryProgress(0);
    }
  };

  const handleCopySection = async (text: string, sectionName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleCopyFullSummary = async () => {
    if (!results) return;
    
    const fullSummary = `
LegalMind AI Document Summary
Generated on: ${new Date(results.processedAt).toLocaleString()}
Language: ${results.documentInfo.language}
Document Type: ${results.documentInfo.type}

EXECUTIVE SUMMARY
${results.executiveSummary}

KEY POINTS
${results.keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

DETAILED ANALYSIS

Parties Involved:
${results.detailedAnalysis.parties.map((party, index) => `${index + 1}. ${party}`).join('\n')}

Key Obligations:
${results.detailedAnalysis.obligations.map((obligation, index) => `${index + 1}. ${obligation}`).join('\n')}

Risk Assessment:
${results.detailedAnalysis.risks.map((risk, index) => `${index + 1}. ${risk}`).join('\n')}

Recommendations:
${results.detailedAnalysis.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

Generated by LegalMind AI - Advanced Legal Intelligence Platform
    `.trim();
    
    try {
      await navigator.clipboard.writeText(fullSummary);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  const handleDownloadSummary = () => {
    if (!results) return;
    
    const fullSummary = `
LegalMind AI Document Summary
Generated on: ${new Date(results.processedAt).toLocaleString()}
Language: ${results.documentInfo.language}
Document Type: ${results.documentInfo.type}
Word Count: ${results.documentInfo.wordCount.toLocaleString()}
Complexity: ${results.documentInfo.complexity}

EXECUTIVE SUMMARY
${results.executiveSummary}

KEY POINTS
${results.keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

DETAILED ANALYSIS

Parties Involved:
${results.detailedAnalysis.parties.map((party, index) => `${index + 1}. ${party}`).join('\n')}

Key Obligations:
${results.detailedAnalysis.obligations.map((obligation, index) => `${index + 1}. ${obligation}`).join('\n')}

Risk Assessment:
${results.detailedAnalysis.risks.map((risk, index) => `${index + 1}. ${risk}`).join('\n')}

Recommendations:
${results.detailedAnalysis.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

Generated by LegalMind AI - Advanced Legal Intelligence Platform
www.legalmind.ai
    `.trim();
    
    const blob = new Blob([fullSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legalmind-summary-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareSummary = async () => {
    if (!results) return;
    
    const shareText = `LegalMind AI Document Summary\n\nDocument Type: ${results.documentInfo.type}\nLanguage: ${results.documentInfo.language}\n\nExecutive Summary: ${results.executiveSummary.substring(0, 200)}...\n\nGenerated by LegalMind AI`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'LegalMind AI Document Summary',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <BookOpen className="h-5 w-5 text-slate-600" />
            AI-Powered Document Summarizer
          </CardTitle>
          <CardDescription className="text-slate-600">
            Generate comprehensive summaries of legal documents with multilingual support and detailed analysis.
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

          {/* Shared Document Alert */}
          {sharedDocument && (
            <Alert className="border-blue-200 bg-blue-50">
              <FileText className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Using analyzed document:</strong> {sharedDocument.name}
                    <div className="text-sm text-blue-600 mt-1">
                      Analyzed on {sharedDocument.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    {Math.floor(sharedDocument.text.length / 1000)}K+ characters
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Document Text Input (if no shared document) */}
          {!sharedDocument && (
            <div className="space-y-3">
              <Label htmlFor="document-text" className="text-slate-700">Legal Document Text</Label>
              <Textarea
                id="document-text"
                placeholder="Paste your legal document text here for comprehensive AI summarization..."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                className="min-h-[200px] bg-white border-slate-300 focus:border-slate-400"
                disabled={summarizing}
              />
              <p className="text-sm text-slate-500">
                Enter at least 500 characters for optimal summary generation
              </p>
            </div>
          )}

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summary Language */}
            <div className="space-y-3">
              <Label htmlFor="summary-language" className="text-slate-700 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Summary Language
              </Label>
              <Select value={summaryLanguage} onValueChange={setSummaryLanguage} disabled={summarizing}>
                <SelectTrigger className="bg-white border-slate-300">
                  <SelectValue placeholder="Select summary language" />
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

            {/* Summary Type */}
            <div className="space-y-3">
              <Label htmlFor="summary-type" className="text-slate-700">Summary Type</Label>
              <Select value={summaryType} onValueChange={setSummaryType} disabled={summarizing}>
                <SelectTrigger className="bg-white border-slate-300">
                  <SelectValue placeholder="Select summary type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300">
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                  <SelectItem value="legal-brief">Legal Brief Format</SelectItem>
                  <SelectItem value="risk-focused">Risk-Focused Summary</SelectItem>
                  <SelectItem value="compliance-check">Compliance Checklist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateSummary} 
            disabled={(!documentText.trim() && !sharedDocument) || summarizing}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white"
          >
            {summarizing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Summary...
              </div>
            ) : (
              'Generate AI Summary'
            )}
          </Button>

          {/* Progress */}
          {summarizing && (
            <div className="space-y-3">
              <Progress value={summaryProgress} className="w-full h-2" />
              <p className="text-sm text-slate-600 text-center">
                {summaryProgress < 30 ? 'Analyzing document structure...' :
                 summaryProgress < 60 ? 'Extracting key information...' :
                 summaryProgress < 90 ? `Generating summary in ${SUPPORTED_LANGUAGES.find(l => l.code === summaryLanguage)?.name}...` :
                 'Finalizing comprehensive analysis...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Summary Header with Actions */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Document Summary Generated
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Comprehensive analysis in {results.documentInfo.language} • {results.documentInfo.wordCount.toLocaleString()} words • {results.documentInfo.complexity} complexity
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCopyFullSummary}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleDownloadSummary}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleShareSummary}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Executive Summary */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-800">Executive Summary</CardTitle>
                <Button
                  onClick={() => handleCopySection(results.executiveSummary, 'Executive Summary')}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">{results.executiveSummary}</p>
            </CardContent>
          </Card>

          {/* Key Points */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-800">Key Points</CardTitle>
                <Button
                  onClick={() => handleCopySection(results.keyPoints.join('\n'), 'Key Points')}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700">
                    <Badge variant="outline" className="mt-0.5 bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      {index + 1}
                    </Badge>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parties */}
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Users className="h-5 w-5 text-slate-600" />
                    Parties Involved
                  </CardTitle>
                  <Button
                    onClick={() => handleCopySection(results.detailedAnalysis.parties.join('\n'), 'Parties')}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.detailedAnalysis.parties.map((party, index) => (
                  <div key={index} className="p-3 border border-slate-200 rounded-xl bg-white/50">
                    <p className="text-sm text-slate-700">{party}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Obligations */}
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <CheckCircle className="h-5 w-5 text-slate-600" />
                    Key Obligations
                  </CardTitle>
                  <Button
                    onClick={() => handleCopySection(results.detailedAnalysis.obligations.join('\n'), 'Obligations')}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.detailedAnalysis.obligations.map((obligation, index) => (
                  <div key={index} className="p-3 border border-slate-200 rounded-xl bg-white/50">
                    <p className="text-sm text-slate-700">{obligation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Risks and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risks */}
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Risk Assessment
                  </CardTitle>
                  <Button
                    onClick={() => handleCopySection(results.detailedAnalysis.risks.join('\n'), 'Risks')}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.detailedAnalysis.risks.map((risk, index) => (
                  <Alert key={index} className="border-l-4 border-l-red-500 bg-white/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-slate-700 text-sm">
                      {risk}
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Recommendations
                  </CardTitle>
                  <Button
                    onClick={() => handleCopySection(results.detailedAnalysis.recommendations.join('\n'), 'Recommendations')}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.detailedAnalysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 border border-green-200 rounded-xl bg-green-50/50">
                    <p className="text-sm text-slate-700">{recommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Processing Info */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center gap-4">
                  <span>Summary generated on {new Date(results.processedAt).toLocaleString()}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Language: {results.documentInfo.language}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Type: {summaryType}</span>
                </div>
                <Badge variant="outline" className="bg-white text-slate-700 border-slate-300">
                  LegalMind AI
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}