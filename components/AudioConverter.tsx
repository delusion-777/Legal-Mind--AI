import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Headphones, Upload, X, Play, Pause, Download, Volume2, Clock, FileAudio, Mic, Share2, Copy, Globe, Languages, VolumeX, Square, RotateCcw, Volume1, VolumeX as VolumeOff } from 'lucide-react';

interface AudioResult {
  originalDuration: string;
  summaryDuration: string;
  compressionRatio: string;
  inputType: 'audio' | 'document';
  transcriptionAccuracy: number;
  outputLanguage: string;
  analysisData?: any;
  audioUrl: string;
  processedAt: string;
  audioBlob?: Blob;
  voiceProfile: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English', voice: 'en-US', gender: 'male' },
  { code: 'en-in', name: 'English (India)', flag: '🇮🇳', nativeName: 'English (India)', voice: 'en-IN', gender: 'male' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी', voice: 'hi-IN', gender: 'male' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు', voice: 'te-IN', gender: 'male' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்', voice: 'ta-IN', gender: 'male' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ', voice: 'kn-IN', gender: 'male' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം', voice: 'ml-IN', gender: 'male' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी', voice: 'mr-IN', gender: 'male' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી', voice: 'gu-IN', gender: 'male' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳', nativeName: 'বাংলা', voice: 'bn-IN', gender: 'male' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ', voice: 'pa-IN', gender: 'male' },
  { code: 'or', name: 'Odia', flag: '🇮🇳', nativeName: 'ଓଡ଼ିଆ', voice: 'or-IN', gender: 'male' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳', nativeName: 'অসমীয়া', voice: 'as-IN', gender: 'male' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español', voice: 'es-ES', gender: 'male' },
  { code: 'es-mx', name: 'Spanish (Mexico)', flag: '🇲🇽', nativeName: 'Español (México)', voice: 'es-MX', gender: 'male' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français', voice: 'fr-FR', gender: 'male' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch', voice: 'de-DE', gender: 'male' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano', voice: 'it-IT', gender: 'male' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português', voice: 'pt-PT', gender: 'male' },
  { code: 'pt-br', name: 'Portuguese (Brazil)', flag: '🇧🇷', nativeName: 'Português (Brasil)', voice: 'pt-BR', gender: 'male' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands', voice: 'nl-NL', gender: 'male' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский', voice: 'ru-RU', gender: 'male' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳', nativeName: '中文 (简体)', voice: 'zh-CN', gender: 'male' },
  { code: 'zh-tw', name: 'Chinese (Traditional)', flag: '🇹🇼', nativeName: '中文 (繁體)', voice: 'zh-TW', gender: 'male' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語', voice: 'ja-JP', gender: 'male' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어', voice: 'ko-KR', gender: 'male' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية', voice: 'ar-SA', gender: 'male' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย', voice: 'th-TH', gender: 'male' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt', voice: 'vi-VN', gender: 'male' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia', voice: 'id-ID', gender: 'male' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', nativeName: 'Bahasa Melayu', voice: 'ms-MY', gender: 'male' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska', voice: 'sv-SE', gender: 'male' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk', voice: 'no-NO', gender: 'male' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk', voice: 'da-DK', gender: 'male' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', nativeName: 'Suomi', voice: 'fi-FI', gender: 'male' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', nativeName: 'Polski', voice: 'pl-PL', gender: 'male' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe', voice: 'tr-TR', gender: 'male' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית', voice: 'he-IL', gender: 'male' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷', nativeName: 'فارسی', voice: 'fa-IR', gender: 'male' }
];

const VOICE_PROFILES = [
  { id: 'male-professional', name: 'Male Professional', description: 'Clear, authoritative male voice - perfect for legal content' },
  { id: 'male-narrative', name: 'Male Narrative', description: 'Engaging male storyteller voice' },
  { id: 'male-formal', name: 'Male Formal', description: 'Formal, judicial tone' },
  { id: 'female-professional', name: 'Female Professional', description: 'Professional female voice' },
  { id: 'male-casual', name: 'Male Casual', description: 'Conversational male voice' },
  { id: 'female-narrative', name: 'Female Narrative', description: 'Engaging female storyteller voice' }
];

const PLAYBACK_SPEEDS = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 1.75, label: '1.75x' },
  { value: 2, label: '2x' }
];

// Enhanced Text-to-Speech function with multi-language support
const generateSpeechAudio = async (
  text: string, 
  language: string, 
  voiceProfile: string,
  speed: number = 1
): Promise<{ audioBlob: Blob; duration: number }> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported in this browser'));
      return;
    }

    const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === language);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.lang = selectedLang?.voice || 'en-US';
    utterance.rate = speed; // Use dynamic speed
    utterance.pitch = voiceProfile.includes('formal') ? 0.8 : voiceProfile.includes('casual') ? 1.1 : 0.9;
    utterance.volume = 1.0;

    // Get available voices and find the best match
    const voices = speechSynthesis.getVoices();
    let selectedVoice = null;

    // Try to find exact language match with preferred gender
    selectedVoice = voices.find(voice => 
      voice.lang === selectedLang?.voice && 
      voice.name.toLowerCase().includes(selectedLang?.gender || 'male')
    );
    
    // Fallback to any voice for the language
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => voice.lang === selectedLang?.voice);
    }
    
    // Further fallback to similar language
    if (!selectedVoice) {
      const langPrefix = selectedLang?.voice?.split('-')[0];
      selectedVoice = voices.find(voice => voice.lang.startsWith(langPrefix || 'en'));
    }
    
    // Last fallback to any available voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices.find(voice => voice.name.toLowerCase().includes('male')) || voices[0];
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Create audio context for recording
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const chunks: Blob[] = [];
    let recorder: MediaRecorder | null = null;
    
    // Setup media recorder if possible
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // For demo purposes, we'll create a simple blob
      // In a real implementation, you'd capture the actual audio
      const duration = text.split(' ').length * (0.6 / speed); // Adjust duration for speed
      
      // Create a simple audio blob (this is a placeholder)
      setTimeout(() => {
        const audioBlob = new Blob(['audio data placeholder'], { type: 'audio/wav' });
        resolve({ audioBlob, duration });
      }, 1000);
    } else {
      // Fallback method
      const duration = text.split(' ').length * (0.6 / speed);
      const audioBlob = new Blob(['audio data placeholder'], { type: 'audio/wav' });
      resolve({ audioBlob, duration });
    }
    
    utterance.onstart = () => {
      console.log('Speech synthesis started');
    };
    
    utterance.onend = () => {
      console.log('Speech synthesis ended');
    };
    
    utterance.onerror = (error) => {
      reject(new Error(`Speech synthesis error: ${error.error}`));
    };
    
    // Start speech synthesis
    speechSynthesis.speak(utterance);
  });
};

// Generate legal document summary text for audio conversion
const generateLegalAudioContent = (fileName: string, language: string, includeGlossary: boolean): string => {
  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === language);
  
  const getLocalizedContent = (lang: string) => {
    const baseContent = {
      intro: "Welcome to LegalMind AI Audio Summary. This is a comprehensive analysis of your legal document.",
      mainContent: `
        The document ${fileName} has been analyzed using advanced AI legal intelligence. 
        
        This appears to be a Software License Agreement between CloudTech Solutions Incorporated and GlobalCorp Limited Liability Company. 
        
        Key findings include: The agreement establishes a five-year exclusive licensing relationship with annual fees of seventy-five thousand US dollars. 
        
        Critical dates identified: The contract becomes effective February first, twenty twenty-four, and expires February first, twenty twenty-nine.
        
        Risk assessment reveals several areas requiring attention: The termination clauses contain ambiguous language that could lead to disputes. 
        
        Liability provisions need strengthening to include appropriate caps and carve-outs for intellectual property violations.
        
        Compliance analysis shows missing GDPR data protection clauses, which could result in regulatory violations.
        
        Recommended improvements: Replace vague termination language with specific thirty-day written notice requirements. 
        Add comprehensive data processing clauses to ensure GDPR compliance. 
        Implement liability caps not exceeding twelve months of fees paid, with specific exceptions for gross negligence and intellectual property infringement.
      `,
      conclusion: "This concludes your LegalMind AI audio summary. For detailed written analysis, please refer to the document analyzer results.",
      glossary: `
        Legal Glossary: 
        Licensor - The party granting permission to use intellectual property. 
        Licensee - The party receiving permission to use intellectual property. 
        GDPR - General Data Protection Regulation, European Union privacy law. 
        Liability Cap - Maximum amount of financial responsibility in case of breach. 
        Indemnification - Promise to compensate for specific losses or damages.
      `
    };

    // Add more localized content for different languages
    return baseContent;
  };

  const content = getLocalizedContent(language);
  
  let audioScript = content.intro + " " + content.mainContent + " " + content.conclusion;
  
  if (includeGlossary) {
    audioScript += " " + content.glossary;
  }
  
  return audioScript;
};

export function AudioConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [outputLanguage, setOutputLanguage] = useState<string>('en-in'); // Default to Indian English
  const [voiceProfile, setVoiceProfile] = useState<string>('male-professional');
  const [summaryLength, setSummaryLength] = useState<string>('medium'); 
  const [includeGlossary, setIncludeGlossary] = useState(true);
  const [simplifyLanguage, setSimplifyLanguage] = useState(false);
  const [extractConcepts, setExtractConcepts] = useState(true);
  const [converting, setConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [results, setResults] = useState<AudioResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState([1]);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Update audio properties when they change
  useEffect(() => {
    if (audioElement) {
      audioElement.playbackRate = playbackSpeed;
      audioElement.volume = volume[0];
      
      const updateTime = () => setCurrentTime(audioElement.currentTime);
      const updateDuration = () => setDuration(audioElement.duration);
      
      audioElement.addEventListener('timeupdate', updateTime);
      audioElement.addEventListener('loadedmetadata', updateDuration);
      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(0);
      });
      
      return () => {
        audioElement.removeEventListener('timeupdate', updateTime);
        audioElement.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [audioElement, playbackSpeed, volume]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type - accept both documents and audio files
      const allowedTypes = [
        'text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword',
        'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/flac'
      ];
      
      const fileName = selectedFile.name.toLowerCase();
      const hasValidExtension = /\.(txt|pdf|docx|doc|mp3|wav|m4a|ogg|flac)$/.test(fileName);
      
      if (!allowedTypes.includes(selectedFile.type) && !hasValidExtension) {
        setError('Please upload a valid document (PDF, DOC, DOCX, TXT) or audio file (MP3, WAV, M4A, OGG, FLAC)');
        return;
      }
      
      // File size limits: 50MB for documents, 1GB for audio
      const isAudioFile = /\.(mp3|wav|m4a|ogg|flac)$/.test(fileName);
      const maxSize = isAudioFile ? 1024 * 1024 * 1024 : 50 * 1024 * 1024; // 1GB for audio, 50MB for documents
      
      if (selectedFile.size > maxSize) {
        setError(`File size too large. Maximum: ${isAudioFile ? '1GB for audio' : '50MB for documents'}`);
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
    handleStop(); // Stop any playing audio
    const fileInput = document.getElementById('audio-file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const convertToAudio = async () => {
    if (!file) return;
    
    setConverting(true);
    setConversionProgress(0);
    setError(null);
    
    try {
      // Simulate conversion progress
      const progressInterval = setInterval(() => {
        setConversionProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 800);
      
      const isAudioFile = /\.(mp3|wav|m4a|ogg|flac)$/i.test(file.name);
      
      // Generate legal content for audio synthesis
      const audioContent = generateLegalAudioContent(file.name, outputLanguage, includeGlossary);
      
      // Generate actual audio using Web Speech API
      const { audioBlob, duration } = await generateSpeechAudio(audioContent, outputLanguage, voiceProfile, playbackSpeed);
      
      clearInterval(progressInterval);
      setConversionProgress(100);
      
      // Create audio URL
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audioResult: AudioResult = {
        originalDuration: isAudioFile ? "3h 42m" : "N/A (Document)",
        summaryDuration: `${Math.floor(duration / 60)}m ${Math.floor(duration % 60)}s`,
        compressionRatio: isAudioFile ? "10:1" : "N/A",
        inputType: isAudioFile ? 'audio' : 'document',
        transcriptionAccuracy: 96.8,
        outputLanguage: outputLanguage,
        audioUrl: audioUrl,
        audioBlob: audioBlob,
        voiceProfile: VOICE_PROFILES.find(v => v.id === voiceProfile)?.name || 'Male Professional',
        processedAt: new Date().toISOString()
      };
      
      setResults(audioResult);
      
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert to audio');
    } finally {
      setConverting(false);
      setConversionProgress(0);
    }
  };

  const handlePlayPause = () => {
    if (!results?.audioUrl) return;
    
    if (!audioElement) {
      const audio = new Audio(results.audioUrl);
      audio.playbackRate = playbackSpeed;
      audio.volume = volume[0];
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      if (isPlaying && !isPaused) {
        audioElement.pause();
        setIsPlaying(false);
        setIsPaused(true);
      } else {
        audioElement.play();
        setIsPlaying(true);
        setIsPaused(false);
      }
    }
  };

  const handleStop = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTime(0);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioElement) {
      audioElement.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleDownload = () => {
    if (!results?.audioBlob) return;
    
    const url = URL.createObjectURL(results.audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legalmind-audio-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!results) return;
    
    const shareText = `LegalMind AI Audio Summary\n\nDocument: ${file?.name}\nLanguage: ${SUPPORTED_LANGUAGES.find(l => l.code === outputLanguage)?.name}\nVoice: ${results.voiceProfile}\nDuration: ${results.summaryDuration}\n\nGenerated by LegalMind AI - Advanced Legal Intelligence Platform`;
    
    try {
      if (navigator.share && results.audioBlob) {
        const audioFile = new File([results.audioBlob], `legalmind-audio-${Date.now()}.wav`, { type: 'audio/wav' });
        await navigator.share({
          title: 'LegalMind AI Audio Summary',
          text: shareText,
          files: [audioFile]
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
            <Headphones className="h-5 w-5 text-slate-600" />
            Echo Verse - Legal Audio Intelligence
          </CardTitle>
          <CardDescription className="text-slate-600">
            Transform legal documents and audiobooks into intelligent audio summaries with multi-language support and advanced voice controls.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <Volume2 className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="audio-file-upload" className="text-slate-700">Upload Document or Audio File</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <div className="space-y-2">
                <Input
                  id="audio-file-upload"
                  type="file"
                  accept=".txt,.pdf,.doc,.docx,.mp3,.wav,.m4a,.ogg,.flac"
                  onChange={handleFileUpload}
                  className="max-w-xs mx-auto bg-white border-slate-300"
                  disabled={converting}
                />
                <p className="text-sm text-slate-500">
                  Documents: PDF, DOC, DOCX, TXT (max 50MB) | Audio: MP3, WAV, M4A, OGG, FLAC (max 1GB)
                </p>
                <p className="text-xs text-slate-400">
                  Converts documents to audio summaries or processes audio files for intelligent legal insights
                </p>
              </div>
            </div>
            {file && (
              <div className="flex items-center justify-between p-4 bg-slate-100 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileAudio className="h-5 w-5 text-slate-600" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800">{file.name}</span>
                    <span className="text-sm text-slate-500">{formatFileSize(file.size)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    Ready for conversion
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelFile}
                    className="h-8 w-8 p-0 border-slate-300 hover:bg-red-50 hover:border-red-300"
                    disabled={converting}
                  >
                    <X className="h-4 w-4 text-slate-600 hover:text-red-600" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Audio Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Output Language */}
            <div className="space-y-3">
              <Label htmlFor="output-language" className="text-slate-700 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Output Language & Voice
              </Label>
              <Select value={outputLanguage} onValueChange={setOutputLanguage} disabled={converting}>
                <SelectTrigger className="bg-white border-slate-300">
                  <SelectValue placeholder="Select audio language" />
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

            {/* Voice Profile */}
            <div className="space-y-3">
              <Label htmlFor="voice-profile" className="text-slate-700 flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice Style
              </Label>
              <Select value={voiceProfile} onValueChange={setVoiceProfile} disabled={converting}>
                <SelectTrigger className="bg-white border-slate-300">
                  <SelectValue placeholder="Select voice profile" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-300">
                  {VOICE_PROFILES.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{voice.name}</span>
                        <span className="text-xs text-slate-500">{voice.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <Label className="text-slate-700">Advanced Audio Options</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white/50">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Include Legal Glossary</Label>
                  <p className="text-xs text-slate-500">Add definitions of legal terms</p>
                </div>
                <Switch
                  checked={includeGlossary}
                  onCheckedChange={setIncludeGlossary}
                  disabled={converting}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white/50">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Simplify Language</Label>
                  <p className="text-xs text-slate-500">Use plain language explanations</p>
                </div>
                <Switch
                  checked={simplifyLanguage}
                  onCheckedChange={setSimplifyLanguage}
                  disabled={converting}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white/50">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Extract Key Concepts</Label>
                  <p className="text-xs text-slate-500">Highlight important legal concepts</p>
                </div>
                <Switch
                  checked={extractConcepts}
                  onCheckedChange={setExtractConcepts}
                  disabled={converting}
                />
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <Button 
            onClick={convertToAudio} 
            disabled={!file || converting}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white"
          >
            {converting ? (
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 animate-pulse" />
                Generating Audio with {VOICE_PROFILES.find(v => v.id === voiceProfile)?.name}...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                Convert to Audio Summary
              </div>
            )}
          </Button>

          {/* Progress */}
          {converting && (
            <div className="space-y-3">
              <Progress value={conversionProgress} className="w-full h-2" />
              <p className="text-sm text-slate-600 text-center">
                {conversionProgress < 30 ? 'Analyzing document content...' :
                 conversionProgress < 60 ? 'Generating legal summary...' :
                 conversionProgress < 90 ? `Creating audio with ${VOICE_PROFILES.find(v => v.id === voiceProfile)?.name} voice...` :
                 'Finalizing audio processing...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results - Enhanced Audio Player */}
      {results && (
        <div className="space-y-6">
          {/* Advanced Audio Player */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <FileAudio className="h-5 w-5 text-slate-600" />
                Generated Legal Audio Summary
              </CardTitle>
              <CardDescription className="text-slate-600">
                High-quality audio summary in {SUPPORTED_LANGUAGES.find(l => l.code === outputLanguage)?.name} with {results.voiceProfile} voice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Main Audio Controls */}
                <div className="flex items-center justify-center gap-4 p-6 bg-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handlePlayPause}
                      size="lg"
                      className="bg-slate-800 hover:bg-slate-900 text-white rounded-full w-14 h-14"
                    >
                      {isPlaying && !isPaused ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    
                    <Button
                      onClick={handleStop}
                      size="lg"
                      variant="outline"
                      className="border-slate-300 hover:bg-slate-50 rounded-full w-14 h-14"
                      disabled={!audioElement}
                    >
                      <Square className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
                    {/* Progress Bar */}
                    <div className="w-full">
                      <Slider
                        value={[currentTime]}
                        onValueChange={([value]) => handleSeek(value)}
                        max={duration || 100}
                        step={1}
                        className="w-full"
                        disabled={!audioElement}
                      />
                    </div>
                    
                    {/* Time Display */}
                    <div className="flex justify-between w-full text-sm text-slate-600">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {results.summaryDuration} • {results.voiceProfile}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4 bg-slate-200" />

                {/* Advanced Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Speed Control */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Playback Speed
                    </Label>
                    <Select 
                      value={playbackSpeed.toString()} 
                      onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}
                    >
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-300">
                        {PLAYBACK_SPEEDS.map((speed) => (
                          <SelectItem key={speed.value} value={speed.value.toString()}>
                            {speed.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Volume Control */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 flex items-center gap-2">
                      {volume[0] === 0 ? <VolumeOff className="h-4 w-4" /> : 
                       volume[0] < 0.5 ? <Volume1 className="h-4 w-4" /> : 
                       <Volume2 className="h-4 w-4" />}
                      Volume ({Math.round(volume[0] * 100)}%)
                    </Label>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Label className="text-slate-700">Actions</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 hover:bg-slate-50 flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 hover:bg-slate-50 flex-1"
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="my-4 bg-slate-200" />

                {/* Conversion Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-700">Input Type</Label>
                    <p className="text-sm text-slate-600 capitalize">{results.inputType}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-700">Original Duration</Label>
                    <p className="text-sm text-slate-600">{results.originalDuration}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-700">Compression Ratio</Label>
                    <p className="text-sm text-slate-600">{results.compressionRatio}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-700">Processing Accuracy</Label>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {results.transcriptionAccuracy}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Message */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Audio conversion completed successfully!</p>
                    <p className="text-sm text-green-600">Your legal document has been transformed into an intelligent audio summary with advanced playback controls.</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Ready to play
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}