import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Bot, X, Send, MessageCircle, Share2, Copy, Trash2, ChevronDown, Settings, RefreshCw } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm LegalMind AI, your comprehensive legal assistant. I can help you with Indian laws, international regulations, legal procedures, and comparative jurisprudence. Ask me anything about constitutional law, corporate regulations, criminal procedures, civil matters, taxation, intellectual property, labor laws, and much more!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Comprehensive Indian and International Legal Knowledge Base
  const legalKnowledgeBase = {
    // Indian Constitutional Law
    constitution: [
      "The Indian Constitution, adopted on 26th January 1950, is the supreme law of India. It establishes fundamental rights (Articles 12-35), directive principles (Articles 36-51), and fundamental duties (Article 51A).",
      "Article 14 guarantees equality before law, Article 19 provides freedom of speech and expression, Article 21 protects life and personal liberty, and Article 32 is the right to constitutional remedies.",
      "The Constitution has a federal structure with Union, State, and Concurrent lists. Parliament can amend the Constitution under Article 368, but basic structure cannot be altered (Kesavananda Bharati case)."
    ],
    
    // Indian Criminal Law
    criminal: [
      "The Bharatiya Nyaya Sanhita (BNS) 2023 has replaced the Indian Penal Code. It covers offenses against the state, public tranquility, human body, property, marriage, defamation, and criminal intimidation.",
      "Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 replaced CrPC, governing criminal procedure including arrest, investigation, trial, and appeal processes.",
      "Bharatiya Sakshya Adhiniyam (BSA) 2023 replaced the Evidence Act, dealing with admissibility, relevancy, and burden of proof in criminal proceedings."
    ],
    
    // Indian Civil Law
    civil: [
      "The Civil Procedure Code (CPC) 1908 governs civil litigation procedures in India. It covers jurisdiction, pleadings, discovery, trial procedures, judgments, and appeals.",
      "Contract Act 1872 defines agreements, consideration, capacity, free consent, void agreements, performance, and breach of contracts.",
      "Transfer of Property Act 1882 regulates sale, mortgage, lease, exchange, and gift of immovable property."
    ],
    
    // Indian Corporate Law
    corporate: [
      "Companies Act 2013 governs incorporation, management, and winding up of companies. It introduced concepts like CSR, independent directors, and related party transactions.",
      "SEBI Act 1992 and SEBI regulations govern securities markets, listing requirements, disclosure norms, and investor protection.",
      "Insolvency and Bankruptcy Code (IBC) 2016 provides a time-bound process for resolving insolvency of companies and individuals."
    ],
    
    // Indian Taxation
    taxation: [
      "Goods and Services Tax (GST) implemented in 2017 is a comprehensive indirect tax on supply of goods and services. It has four slabs: 5%, 12%, 18%, and 28%.",
      "Income Tax Act 1961 governs direct taxation of individuals, companies, and other entities. It covers computation, assessment, appeals, and penalties.",
      "Central and State GST laws work together with Input Tax Credit (ITC) mechanism to avoid cascading effect of taxes."
    ],
    
    // International Law
    international: [
      "International law consists of treaties, customary international law, general principles, and judicial decisions. Vienna Convention on Law of Treaties 1969 governs treaty interpretation.",
      "UN Charter establishes principles of international law including sovereign equality, prohibition of use of force, and peaceful settlement of disputes.",
      "International Court of Justice (ICJ) is the principal judicial organ of the UN, deciding disputes between states and giving advisory opinions."
    ],
    
    // Intellectual Property
    intellectual: [
      "Patents Act 1970 protects inventions for 20 years. Patentability requires novelty, inventive step, and industrial application. Software per se is not patentable in India.",
      "Copyright Act 1957 protects original literary, dramatic, musical, and artistic works. Copyright lasts for author's lifetime plus 60 years.",
      "Trade Marks Act 1999 protects distinctive signs used in trade. Registration provides exclusive rights for 10 years, renewable indefinitely."
    ],
    
    // Labor and Employment Law
    labor: [
      "Labour Code on Wages 2019 consolidates four laws including Minimum Wages Act. It covers wage payment, bonus, and equal remuneration provisions.",
      "Industrial Relations Code 2020 covers trade unions, conditions of employment, layoff, retrenchment, and closure provisions.",
      "Code on Social Security 2020 provides social security benefits including provident fund, gratuity, maternity benefits, and employee compensation."
    ],
    
    // International Commercial Law
    commercial: [
      "UNCITRAL Model Law on International Commercial Arbitration is adopted by many countries including India through Arbitration Act 2015.",
      "Hague Convention on International Sale of Goods (CISG) governs international sale contracts between parties from different contracting states.",
      "INCOTERMS 2020 define standard trade terms used in international contracts, including delivery, risk transfer, and cost allocation."
    ],
    
    // Comparative Constitutional Law
    comparative: [
      "Common law systems (UK, India, Canada) emphasize judicial precedent and case law, while civil law systems (France, Germany) rely primarily on written codes.",
      "Federal systems like India, USA, and Germany divide powers between central and state governments, while unitary systems like UK concentrate power centrally.",
      "Judicial review varies: strong in USA and India (Marbury v Madison, Kesavananda Bharati), limited in UK due to parliamentary sovereignty."
    ],
    
    // Cyber Law
    cyber: [
      "Information Technology Act 2000 (amended 2008) governs cyber crimes, electronic governance, and digital signatures in India.",
      "GDPR (EU) and Personal Data Protection Bill (India) regulate data processing, requiring consent, providing data subject rights, and imposing penalties for breaches.",
      "Cyber crimes include hacking (Section 66), identity theft (Section 66C), and cyber terrorism (Section 66F) with penalties up to life imprisonment."
    ]
  };

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Indian Legal System Queries
    if (input.includes('indian constitution') || input.includes('fundamental rights') || input.includes('directive principles')) {
      const responses = legalKnowledgeBase.constitution;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('bns') || input.includes('bharatiya nyaya') || input.includes('ipc') || input.includes('criminal law')) {
      const responses = legalKnowledgeBase.criminal;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('cpc') || input.includes('civil procedure') || input.includes('contract act') || input.includes('civil law')) {
      const responses = legalKnowledgeBase.civil;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('companies act') || input.includes('corporate law') || input.includes('sebi') || input.includes('ibc')) {
      const responses = legalKnowledgeBase.corporate;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('gst') || input.includes('income tax') || input.includes('taxation') || input.includes('tax law')) {
      const responses = legalKnowledgeBase.taxation;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('patent') || input.includes('copyright') || input.includes('trademark') || input.includes('intellectual property')) {
      const responses = legalKnowledgeBase.intellectual;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('labor') || input.includes('labour') || input.includes('employment') || input.includes('industrial relations')) {
      const responses = legalKnowledgeBase.labor;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('cyber law') || input.includes('it act') || input.includes('gdpr') || input.includes('data protection')) {
      const responses = legalKnowledgeBase.cyber;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // International Law Queries
    if (input.includes('international law') || input.includes('treaty') || input.includes('un charter') || input.includes('icj')) {
      const responses = legalKnowledgeBase.international;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('arbitration') || input.includes('uncitral') || input.includes('commercial law') || input.includes('incoterms')) {
      const responses = legalKnowledgeBase.commercial;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (input.includes('comparative') || input.includes('common law') || input.includes('civil law') || input.includes('federal')) {
      const responses = legalKnowledgeBase.comparative;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Specific Legal Procedures and Rights
    if (input.includes('article 370') || input.includes('kashmir')) {
      return "Article 370 was abrogated in August 2019. It previously gave special autonomous status to Jammu and Kashmir. The Supreme Court in 2023 upheld the abrogation, stating it was a temporary provision that could be modified by Presidential order.";
    }
    
    if (input.includes('article 35a')) {
      return "Article 35A was also nullified with Article 370's abrogation. It allowed J&K legislature to define permanent residents and their special rights and privileges. This has been replaced by domicile laws under the J&K Reorganisation Act 2019.";
    }
    
    if (input.includes('triple talaq') || input.includes('muslim personal law')) {
      return "The Muslim Personal Law (Shariat) Application Act 1937 governs Muslim personal matters. Triple Talaq was criminalized by the Muslim Personal Law (Shariat) Application Act 2019 after Supreme Court's Shayara Bano judgment declaring it unconstitutional.";
    }
    
    if (input.includes('uniform civil code') || input.includes('ucc')) {
      return "Uniform Civil Code under Article 44 (Directive Principle) aims to have common personal laws for all citizens. Currently, Goa has UCC. The debate continues on implementing UCC nationwide, balancing religious freedom with gender equality and national integration.";
    }
    
    if (input.includes('sedition') || input.includes('section 124a')) {
      return "Section 124A IPC (now Section 150 BNS) defines sedition as bringing hatred or contempt against the government. Recent Supreme Court cases like Kedar Nath Singh set the standard requiring incitement to violence or public disorder, not mere criticism.";
    }
    
    if (input.includes('section 377') || input.includes('homosexuality')) {
      return "Section 377 IPC was partially struck down in Navtej Singh Johar v Union of India (2018), decriminalizing homosexuality between consenting adults. The section now applies only to non-consensual acts and those involving minors.";
    }
    
    // International Comparisons
    if (input.includes('usa') || input.includes('american law') || input.includes('us constitution')) {
      return "The US Constitution (1787) is the world's oldest written constitution. It established separation of powers, checks and balances, and federalism. The Bill of Rights (first 10 amendments) protects individual liberties. Judicial review was established in Marbury v Madison (1803).";
    }
    
    if (input.includes('uk') || input.includes('british law') || input.includes('common law')) {
      return "UK follows an unwritten constitution based on conventions, statutes, and common law. Parliamentary sovereignty is supreme - Parliament can make or unmake any law. The Human Rights Act 1998 incorporated ECHR rights into domestic law.";
    }
    
    if (input.includes('european union') || input.includes('eu law') || input.includes('echr')) {
      return "EU law consists of primary law (treaties) and secondary law (regulations, directives). EU law has direct effect and supremacy over national law. European Court of Human Rights enforces the European Convention on Human Rights across 47 member states.";
    }
    
    // Procedural Queries
    if (input.includes('how to file') || input.includes('procedure') || input.includes('court process')) {
      return "Legal procedure depends on the matter: Civil cases follow CPC 1908, criminal cases follow BNSS 2023. Generally: 1) File appropriate petition/complaint, 2) Pay court fees, 3) Serve notice to opposite party, 4) Appear for hearings, 5) Present evidence and arguments, 6) Await judgment. Consider consulting a lawyer for specific guidance.";
    }
    
    if (input.includes('bail') || input.includes('anticipatory bail')) {
      return "Bail is granted under BNSS 2023. Regular bail is sought after arrest, anticipatory bail before arrest under Section 438 CrPC (now Section 482 BNSS). Factors considered: gravity of offense, flight risk, evidence tampering possibility, and criminal history. Bail is generally the rule, jail the exception.";
    }
    
    if (input.includes('limitation period') || input.includes('time limit')) {
      return "Limitation Act 1963 prescribes time limits for legal proceedings: Civil suits - generally 3 years, Contract disputes - 3 years, Tort - 3 years, Recovery of money - 3 years, Criminal cases - Generally no limitation except defamation (1 year). Court can condone delay in exceptional circumstances.";
    }
    
    // Recent Legal Developments
    if (input.includes('new criminal laws') || input.includes('2023 criminal laws')) {
      return "Three new criminal laws implemented from July 1, 2024: Bharatiya Nyaya Sanhita (BNS) replacing IPC, Bharatiya Nagarik Suraksha Sanhita (BNSS) replacing CrPC, and Bharatiya Sakshya Adhiniyam (BSA) replacing Evidence Act. Key changes include community service, zero FIR, and digitization of criminal justice system.";
    }
    
    if (input.includes('data protection bill') || input.includes('privacy law')) {
      return "Digital Personal Data Protection Act 2023 is India's comprehensive data protection law. It requires consent for data processing, provides data subject rights (access, correction, erasure), imposes penalties up to ₹250 crores, and establishes Data Protection Board for enforcement.";
    }
    
    // Questions and Help
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm your comprehensive legal assistant specializing in Indian and international law. I can help with constitutional law, criminal law, civil procedures, corporate regulations, taxation, IP law, labor law, cyber law, and comparative jurisprudence. What legal topic would you like to explore?";
    }
    
    if (input.includes('help') || input.includes('what can you do')) {
      return "I can provide detailed information on: 🇮🇳 Indian Laws (Constitutional, Criminal, Civil, Corporate, Tax, IP, Labor, Cyber), 🌍 International Law (Treaties, ICJ, Commercial, Human Rights), ⚖️ Legal Procedures (Filing, Bail, Appeals, Limitation), 📊 Comparative Law (Common vs Civil law systems), 📋 Recent Legal Developments. Ask me anything specific!";
    }
    
    if (input.includes('thank')) {
      return "You're most welcome! I'm always here to assist with your legal queries. Whether it's Indian law, international regulations, or comparative legal analysis, feel free to ask anytime. Stay legally informed!";
    }
    
    // Default comprehensive responses
    const comprehensiveResponses = [
      "That's a complex legal matter! Indian law is vast and interconnected. Could you be more specific about which aspect you'd like to know - whether it's constitutional provisions, statutory requirements, procedural aspects, or judicial interpretations? I can provide detailed guidance on any area of Indian or international law.",
      "Legal questions often require understanding the specific context and jurisdiction. In India, we have central laws, state laws, and local regulations. For international matters, treaties and conventions apply. Could you clarify which legal system or specific statute you're interested in?",
      "That's an important legal topic! The answer may vary depending on whether you're looking at it from a constitutional law perspective, statutory compliance, or practical implementation. I can explain the legal framework, recent amendments, judicial precedents, and comparative international practices. What specific angle interests you?",
      "Excellent question! Legal principles often evolve through legislation, judicial decisions, and constitutional amendments. In the Indian legal system, we also need to consider federal vs state jurisdiction, fundamental rights implications, and directive principles. Which particular aspect would you like me to elaborate on?",
      "That touches on a significant area of law! Whether it's Indian jurisprudence, international conventions, or comparative legal analysis, I can provide comprehensive insights. The legal landscape includes statutory provisions, case law developments, regulatory guidelines, and practical implications. What specific dimension would you like to explore?"
    ];
    
    return comprehensiveResponses[Math.floor(Math.random() * comprehensiveResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate thinking time for comprehensive legal research
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    const botResponse: Message = {
      id: messages.length + 2,
      text: getResponse(inputText),
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm LegalMind AI, your comprehensive legal assistant. I can help you with Indian laws, international regulations, legal procedures, and comparative jurisprudence. Ask me anything!",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setInputText('');
    setShowScrollToBottom(false);
  };

  const handleCopyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleShareConversation = async () => {
    const conversationText = messages
      .map(msg => `${msg.sender === 'bot' ? '🤖 LegalMind AI' : '👤 You'}: ${msg.text}`)
      .join('\n\n');
    
    try {
      await navigator.clipboard.writeText(`LegalMind AI Legal Consultation\n\n${conversationText}`);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to share conversation:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollToBottom(false);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
    
    setShowScrollToBottom(!isAtBottom && messages.length > 3);
    setAutoScroll(isAtBottom);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Auto-scroll to bottom when new messages are added (only if already at bottom)
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, autoScroll]);

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 h-[650px] mb-4 bg-white/95 backdrop-blur-sm border-slate-200 shadow-xl flex flex-col">
          <CardHeader className="pb-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="relative">
                  {/* Cute Sheep Icon */}
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">🐑</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <div>LegalMind AI Assistant</div>
                  <div className="text-xs font-normal opacity-80">Indian & International Legal Expert</div>
                </div>
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearChat}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  title="Clear chat history"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleShareConversation}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  title="Share conversation"
                >
                  <Share2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleChat}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 flex flex-col relative">
            {/* Messages Area with Custom Scroll */}
            <div className="flex-1 relative">
              <ScrollArea 
                className="h-full"
                onScroll={handleScroll}
              >
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg relative group ${
                          message.sender === 'bot'
                            ? 'bg-slate-100 text-slate-800'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {message.sender === 'bot' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyMessage(message.text)}
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                              title="Copy message"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 text-slate-800 p-3 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Invisible element to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Scroll to Bottom Button */}
              {showScrollToBottom && (
                <Button
                  onClick={scrollToBottom}
                  size="sm"
                  className="absolute bottom-4 right-4 rounded-full w-8 h-8 p-0 bg-slate-700 hover:bg-slate-800 text-white shadow-lg z-10"
                  title="Scroll to bottom"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Message Count Indicator */}
            {messages.length > 1 && (
              <div className="px-4 py-1 text-center">
                <span className="text-xs text-slate-500">
                  {messages.length} messages • {messages.filter(m => m.sender === 'bot').length} responses
                </span>
              </div>
            )}
            
            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about Indian laws, international regulations..."
                    className="bg-slate-50 border-slate-300 focus:border-slate-400 pr-10"
                    disabled={isTyping}
                    maxLength={1000}
                  />
                  {inputText.length > 800 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      {1000 - inputText.length}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="bg-slate-700 hover:bg-slate-800 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-500">
                  🇮🇳 Indian Law • 🌍 International Law • ⚖️ Legal Procedures • 📋 Recent Updates
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAutoScroll(!autoScroll)}
                  className="h-4 w-4 p-0 text-slate-400 hover:text-slate-600"
                  title={autoScroll ? "Disable auto-scroll" : "Enable auto-scroll"}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Toggle Button with Message Count */}
      <div className="relative">
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <div className="relative">
              {/* Cute Sheep Icon */}
              <span className="text-2xl">🐑</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </Button>
        
        {/* Unread Message Indicator */}
        {!isOpen && messages.length > 1 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {messages.length - 1 > 9 ? '9+' : messages.length - 1}
          </div>
        )}
      </div>
    </div>
  );
}