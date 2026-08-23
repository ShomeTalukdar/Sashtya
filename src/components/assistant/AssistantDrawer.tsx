import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  ShieldAlert, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  AlertTriangle 
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { VoiceService } from '../../services/voiceService';

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenEmergency: () => void;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenEmergency
}) => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'bn' | 'or'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>(() => VoiceService.getInitialMessages('en'));
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const handleLanguageChange = (lang: 'en' | 'hi' | 'bn' | 'or') => {
    setSelectedLang(lang);
    setMessages(VoiceService.getInitialMessages(lang));
    setSpeechError(null);
  };

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setInterimTranscript('');
    setSpeechError(null);

    setTimeout(() => {
      const botResponse = VoiceService.processUserInput(query, selectedLang);
      setMessages([...updated, botResponse]);

      if (!isSoundMuted) {
        const ttsLangMap = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', or: 'or-IN' };
        VoiceService.speakText(botResponse.text, ttsLangMap[selectedLang]);
      }
    }, 300);
  };

  const handleMicToggle = () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Browser speech recognition unavailable. Click sample prompts below.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      setInterimTranscript('');
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        const sttLangMap = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', or: 'or-IN' };
        recognition.lang = sttLangMap[selectedLang];
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsListening(true);
          setInterimTranscript('');
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim);
          }

          if (finalTranscript) {
            setInput(finalTranscript);
            setInterimTranscript('');
            setIsListening(false);
            handleSend(finalTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          setInterimTranscript('');
          setSpeechError(`Voice error: ${event.error}. Use quick prompts below.`);
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognition.start();
      } catch (err: any) {
        setIsListening(false);
        setSpeechError("Microphone start failed.");
      }
    }
  };

  const handleActionClick = (action: string) => {
    if (action === 'emergency') {
      onClose();
      onOpenEmergency();
    } else if (action === 'view_medicines' || action === 'medicine' || action === 'mark_taken') {
      onClose();
      onNavigate('medicines');
    } else if (action === 'view_appointments' || action === 'appointment') {
      onClose();
      onNavigate('appointments');
    } else if (action === 'view_insurance' || action === 'insurance') {
      onClose();
      onNavigate('insurance');
    } else if (action === 'view_bills' || action === 'bills') {
      onClose();
      onNavigate('bills');
    } else if (action === 'records') {
      onClose();
      onNavigate('records');
    } else if (action === 'hospitals') {
      onClose();
      onNavigate('hospitals');
    } else if (action === 'symptoms_help') {
      const promptMap = {
        en: 'I have fever and body pain, recommend a doctor',
        hi: 'मुझे बुखार और शरीर दर्द है, डॉक्टर बताएं',
        bn: 'আমার জ্বর ও শরীর ব্যথা, ডাক্তার বলুন',
        or: 'ମୋତେ ଜ୍ଵର ଓ ଗୋଡ଼ହାତ ବିନ୍ଧା ହେଉଛି, ଡାକ୍ତର କହନ୍ତୁ'
      };
      handleSend(promptMap[selectedLang]);
    }
  };

  const placeholders = {
    en: "Type symptoms or questions...",
    hi: "लक्षण या सवाल लिखें...",
    bn: "লক্ষণ বা প্রশ্ন লিখুন...",
    or: "ଲକ୍ଷଣ କିମ୍ବା ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ..."
  };

  const voiceSamples = {
    en: [
      "I have fever and body pain",
      "When is my next medicine due?",
      "Open emergency card"
    ],
    hi: [
      "मुझे बुखार और शरीर दर्द है",
      "मेरी अगली दवा कब है?",
      "इमरजेंसी कार्ड खोलो"
    ],
    bn: [
      "আমার জ্বর ও শরীর ব্যথা",
      "আমার পরের ওষুধ কখন?",
      "ইমার্জেন্সি কার্ড খুলুন"
    ],
    or: [
      "ମୋତେ ଜ୍ଵର ଓ ଗୋଡ଼ହାତ ବିନ୍ଧା ହେଉଛି",
      "ମୋର ପରବର୍ତ୍ତୀ ଔଷଧ କେବେ?",
      "ଇମର୍ଜେନ୍ସି କାର୍ଡ ଖୋଲନ୍ତୁ"
    ]
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md h-full flex flex-col shadow-2xl border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                SWASTYA Assistant
              </h3>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSoundMuted(!isSoundMuted)}
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                title={isSoundMuted ? "Unmute" : "Mute"}
              >
                {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button onClick={onClose} className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1">
            {[
              { code: 'en', label: 'EN' },
              { code: 'hi', label: 'HI' },
              { code: 'bn', label: 'BN' },
              { code: 'or', label: 'OR' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as any)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedLang === lang.code
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 px-4 py-2 text-[11px] text-zinc-500 flex items-center gap-1.5 shrink-0 bg-zinc-50 dark:bg-zinc-900/60">
          <ShieldAlert className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Informational OTC guidance only. For medical emergencies, use Emergency.</span>
        </div>

        {/* Error Banner */}
        {speechError && (
          <div className="px-4 py-2 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{speechError}</span>
            </div>
            <button onClick={() => setSpeechError(null)} className="font-semibold text-xs ml-2">✕</button>
          </div>
        )}

        {/* Listening State */}
        {isListening && (
          <div className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 text-xs flex items-center justify-between shrink-0">
            <span>Listening... {interimTranscript}</span>
            <button onClick={handleMicToggle} className="underline text-xs">Stop</button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                {msg.text}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-700 flex flex-wrap gap-1">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(act.action)}
                        className="px-2 py-1 rounded text-[11px] font-medium border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-1 transition-colors"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 mt-0.5 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Quick Voice Prompts */}
        <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800 overflow-x-auto shrink-0 flex items-center gap-1.5 scrollbar-none text-xs">
          <span className="text-[10px] font-medium text-zinc-400 uppercase whitespace-nowrap">Suggested:</span>
          {voiceSamples[selectedLang].map((sample, i) => (
            <button
              key={i}
              onClick={() => handleSend(sample)}
              className="px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] whitespace-nowrap transition-colors shrink-0"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleMicToggle}
              className={`p-2 rounded-md border text-xs transition-colors ${
                isListening
                  ? 'border-red-500 text-red-500'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={placeholders[selectedLang]}
              className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400"
            />

            <button
              onClick={() => handleSend()}
              className="p-2 rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AssistantDrawer;
