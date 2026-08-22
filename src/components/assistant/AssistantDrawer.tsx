import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Globe,
  Stethoscope,
  Volume2,
  VolumeX,
  AlertTriangle
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { VoiceService } from '../../services/voiceService';
import { MedicationService } from '../../services/medicationService';

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

  // Clean up speech recognition on unmount or drawer close
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

    // Process assistant NLP response with language context
    setTimeout(() => {
      const botResponse = VoiceService.processUserInput(query, selectedLang);
      setMessages([...updated, botResponse]);

      // Speech synthesis language code mapping
      if (!isSoundMuted) {
        const ttsLangMap = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', or: 'or-IN' };
        VoiceService.speakText(botResponse.text, ttsLangMap[selectedLang]);
      }
    }, 400);
  };

  const handleMicToggle = () => {
    setSpeechError(null);

    // Check speech recognition API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Browser speech recognition API unavailable. Use quick sample voice prompts below.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
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
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          setInterimTranscript('');
          if (event.error === 'not-allowed') {
            setSpeechError("Microphone permission denied by browser. Please enable mic access in browser address bar.");
          } else if (event.error === 'no-speech') {
            setSpeechError("No speech detected. Please try speaking clearly or use quick voice prompts.");
          } else {
            setSpeechError(`Voice error: ${event.error}. Use quick voice samples below for instant demo.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognition.start();
      } catch (err: any) {
        console.error("Mic start failed:", err);
        setIsListening(false);
        setSpeechError("Microphone initialization failed. Try clicking quick voice prompts.");
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
    en: "Type or speak symptoms (e.g. 'fever & body pain')...",
    hi: "लक्षण बोलें या लिखें (जैसे 'बुखार और सिर दर्द')...",
    bn: "বলুন বা লিখুন (যেমন 'জ্বর ও গলা ব্যথা')...",
    or: "କହନ୍ତୁ କିମ୍ବା ଲେଖନ୍ତୁ (ଯେପରି 'ଜ୍ଵର ଓ ପେଟ ବିନ୍ଧା')..."
  };

  // Sample voice command shortcuts per language for seamless presentation testing
  const voiceSamples = {
    en: [
      "I have fever and body pain",
      "I am having acidity and gastric heartburn",
      "When is my next medicine due?",
      "Open emergency card"
    ],
    hi: [
      "मुझे बुखार और शरीर दर्द है",
      "मुझे एसिडिटी और पेट में गैस है",
      "मेरी अगली दवा कब है?",
      "इमरजेंसी कार्ड खोलो"
    ],
    bn: [
      "আমার জ্বর ও শরীর ব্যথা করছে",
      "আমার এসিডিটি ও পেট খারাপ",
      "আমার পরের ওষুধ কখন?",
      "ইমার্জেন্সি কার্ড খুলুন"
    ],
    or: [
      "ମୋତେ ଜ୍ଵର ଓ ଗୋଡ଼ହାତ ବିନ୍ଧା ହେଉଛି",
      "ମୋର ଗ୍ୟାସ ଓ ଅମ୍ଳତା ହେଉଛି",
      "ମୋର ପରବର୍ତ୍ତୀ ଔଷଧ କେବେ?",
      "ଇମର୍ଜେନ୍ସି କାର୍ଡ ଖୋଲନ୍ତୁ"
    ]
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-[#FAF7F0] w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 border-l border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0057B8] text-white p-4 sm:p-5 flex flex-col gap-3 shadow-md shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg flex items-center gap-1.5">
                  SWASTYA Multilingual AI Assistant
                  <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" />
                    Symptom AI
                  </span>
                </h3>
                <p className="text-xs text-white/80 font-medium">Voice Recognition & OTC Medicine Diagnosis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSoundMuted(!isSoundMuted)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                title={isSoundMuted ? "Unmute Voice Speech" : "Mute Voice Speech"}
              >
                {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={onClose} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Multilingual Selector Pills (EN, HI, BN, OR) */}
          <div className="flex items-center justify-between bg-black/20 p-1.5 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-white/90 flex items-center gap-1 pl-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Mic & Speech Lang:</span>
            </span>
            <div className="flex items-center gap-1">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'bn', label: 'বাংলা' },
                { code: 'or', label: 'ଓଡ଼ିଆ' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code as any)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all ${
                    selectedLang === lang.code
                      ? 'bg-white text-[#0057B8] shadow-sm scale-105'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-[11px] font-semibold text-amber-900 flex items-center gap-2 shrink-0">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Assistant provides OTC first-aid & medicine guidance. For urgent medical emergencies, press Emergency.</span>
        </div>

        {/* Speech Error Banner if permission or mic fails */}
        {speechError && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs font-semibold text-red-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{speechError}</span>
            </div>
            <button onClick={() => setSpeechError(null)} className="text-red-600 font-extrabold text-xs ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Active Mic Listening Animated Wave Bar */}
        {isListening && (
          <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between animate-in slide-in-from-top duration-150 shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white animate-ping" />
              <div>
                <span className="font-extrabold text-xs uppercase tracking-wider block">
                  Listening in {selectedLang === 'en' ? 'English (en-IN)' : selectedLang === 'hi' ? 'हिंदी (hi-IN)' : selectedLang === 'bn' ? 'বাংলা (bn-IN)' : 'ଓଡ଼ିଆ (or-IN)'}...
                </span>
                <span className="text-[11px] text-red-100 italic">
                  {interimTranscript || 'Speak into your microphone now...'}
                </span>
              </div>
            </div>
            <button 
              onClick={handleMicToggle}
              className="px-3 py-1 rounded-xl bg-white text-red-700 font-extrabold text-xs shadow-xs hover:bg-red-50"
            >
              Stop Mic
            </button>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-2xs whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-[#0057B8] text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(act.action)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#EAF3FF] text-[#0057B8] hover:bg-blue-100 font-extrabold text-xs flex items-center gap-1 transition-colors border border-blue-200"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Quick Voice Command Samples for Presentation Demo */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto shrink-0 flex items-center gap-1.5 scrollbar-none">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase whitespace-nowrap flex items-center gap-1 mr-1">
            <Mic className="w-3 h-3 text-[#0057B8]" /> Quick Spoken Prompts:
          </span>
          {voiceSamples[selectedLang].map((sample, i) => (
            <button
              key={i}
              onClick={() => handleSend(sample)}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-blue-50 text-slate-800 hover:text-[#0057B8] text-[11px] font-semibold whitespace-nowrap border border-slate-200 shadow-2xs transition-colors shrink-0"
            >
              "{sample}"
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 space-y-2">
          
          <div className="flex items-center gap-2">
            
            {/* Mic Toggle Button */}
            <button
              onClick={handleMicToggle}
              title={`Voice Input (${selectedLang.toUpperCase()})`}
              className={`p-3 rounded-2xl font-bold transition-all flex items-center gap-1.5 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-md'
                  : 'bg-[#EAF3FF] text-[#0057B8] hover:bg-blue-100 border border-blue-200'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#0057B8]" />}
              <span className="text-xs font-extrabold uppercase hidden sm:inline">{selectedLang}</span>
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={placeholders[selectedLang]}
              className="flex-1 bg-slate-100 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#0057B8] focus:bg-white transition-all font-medium"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              className="p-3 rounded-2xl bg-[#0057B8] hover:bg-blue-800 text-white transition-colors shadow-md active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
