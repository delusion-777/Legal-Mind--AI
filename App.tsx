import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { DocumentAnalyzer } from "./components/DocumentAnalyzer";
import { DocumentSummarizer } from "./components/DocumentSummarizer";
import { AudioConverter } from "./components/AudioConverter";
import { ChatBot } from "./components/ChatBot";
import {
  FileText,
  BookOpen,
  Headphones,
  Scale,
  Gavel,
  ShieldCheck,
} from "lucide-react";

// Professional Logo Component with Justice Symbol
const LegalMindLogo = () => (
  <div className="flex items-center gap-3">
    <div className="relative">
      {/* Outer circle with gradient */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center shadow-lg">
        {/* Justice Scale Symbol */}
        <div className="relative">
          <Scale
            className="h-6 w-6 text-slate-100"
            strokeWidth={1.5}
          />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <ShieldCheck
              className="h-2 w-2 text-white"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400/20 to-slate-600/20 blur-sm -z-10"></div>
    </div>
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
          LegalMind
        </h1>
        <span className="text-lg font-medium text-blue-600">
          AI
        </span>
      </div>
      <p className="text-sm text-slate-600 font-medium tracking-wide">
        Advanced Legal Intelligence Platform
      </p>
    </div>
  </div>
);

interface SharedDocument {
  name: string;
  text: string;
  analysisResults?: any;
  timestamp: Date;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("analyzer");
  const [sharedDocument, setSharedDocument] =
    useState<SharedDocument | null>(null);

  const handleDocumentAnalyzed = (
    documentData: SharedDocument,
  ) => {
    setSharedDocument(documentData);
  };

  const handleUseSharedDocument = () => {
    if (sharedDocument) {
      setActiveTab("summarizer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Professional Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <LegalMindLogo />

            {/* Document Status Indicator */}
            {sharedDocument && (
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">
                    Document Ready
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUseSharedDocument}
                  className="text-xs"
                >
                  Use in Summarizer
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-sm p-1">
            <TabsTrigger
              value="analyzer"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-800 text-slate-600 transition-all duration-200"
            >
              <FileText className="h-4 w-4" />
              Document Analyzer
            </TabsTrigger>
            <TabsTrigger
              value="summarizer"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-800 text-slate-600 transition-all duration-200"
            >
              <BookOpen className="h-4 w-4" />
              Document Summarizer
            </TabsTrigger>
            <TabsTrigger
              value="audio"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-800 text-slate-600 transition-all duration-200"
            >
              <Headphones className="h-4 w-4" />
              Echo Verse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer">
            <DocumentAnalyzer
              onDocumentAnalyzed={handleDocumentAnalyzed}
            />
          </TabsContent>

          <TabsContent value="summarizer">
            <DocumentSummarizer
              sharedDocument={sharedDocument}
            />
          </TabsContent>

          <TabsContent value="audio">
            <AudioConverter />
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating ChatBot */}
      <ChatBot />
    </div>
  );
}