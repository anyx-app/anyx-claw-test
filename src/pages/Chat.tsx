import { useState, useRef, useEffect } from 'react';
import { ChatInterface } from '../components/recipes/ai/ChatInterface';
import { ChatMessageProps } from '../components/recipes/ai/ChatMessage';
import { MOCK_TRENDS } from '../data/mockTrends';
import { TrendCard } from '../components/TrendCard';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = location.state?.initialQuery;

  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      role: 'assistant',
      content: "I'm ready to help you scout the market. What specific area or industry are you interested in?",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [loading, setLoading] = useState(false);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default Muted
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Stop AI speech if user wants to talk (Interrupt)
    if (isSpeaking) {
      stopSpeaking();
    }

    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (error) {
      console.error("Mic start error:", error);
      // Re-initialize if it crashed (common on mobile)
      initSpeech();
      setTimeout(() => recognitionRef.current?.start(), 100);
    }
  };

  const initSpeech = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // Explicit lang helps iOS
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  };

  // Initialize Speech Recognition on Mount
  useEffect(() => {
    initSpeech();
  }, []);

  // Handle Initial Query from Home Page
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
      // Clear state so it doesn't re-send on refresh
      window.history.replaceState({}, document.title);
    }
  }, [initialQuery]);

  const speak = (text: string) => {
    if (isMuted) return; // Don't speak if muted
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthesisRef.current.speak(utterance);
  };

  const toggleMute = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setIsMuted(!isMuted);
  };

  // Removed duplicate toggleVoice definition


  const stopSpeaking = () => {
    synthesisRef.current.cancel();
    setIsSpeaking(false);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessageProps = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Don't send the ReactNode system messages to the API, filter them out
      const apiMessages = messages.filter(m => typeof m.content === 'string');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...apiMessages, userMsg] }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // Add AI Text Response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString(),
      }]);
      
      // Auto-speak the response
      speak(data.text);

      // If trends are recommended, add a system message with the cards as ReactNode content
      if (data.recommendedTrendIds && data.recommendedTrendIds.length > 0) {
        const recommendedCards = MOCK_TRENDS.filter(t => data.recommendedTrendIds.includes(t.id));
        
        if (recommendedCards.length > 0) {
          setMessages(prev => [...prev, {
            role: 'system',
            content: (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2 w-full"
              >
                {recommendedCards.map((t) => (
                  <div key={t.id} className="scale-95 origin-top-left w-full text-left">
                    <TrendCard trend={t} />
                  </div>
                ))}
              </motion.div>
            ),
            timestamp: new Date().toLocaleTimeString(),
          }]);
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I lost connection to the market feed. Please check your API keys.",
        timestamp: new Date().toLocaleTimeString(),
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-4 justify-between bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="font-semibold">Market Scout Agent</div>
        <div className="flex gap-2">
           <Button 
            variant={isMuted ? "ghost" : "default"} 
            size="icon" 
            onClick={toggleMute}
            className={!isMuted && isSpeaking ? "animate-pulse" : ""}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button 
            variant={isListening ? "default" : "outline"} 
            size="icon" 
            onClick={toggleVoice}
            className={isListening ? "animate-pulse ring-2 ring-primary" : ""}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden relative">
        <ChatInterface 
          messages={messages}
          onSendMessage={handleSendMessage}
          loading={loading}
          enableVoice={true}
          className="h-full border-none rounded-none shadow-none"
        />
      </div>
    </div>
  );
}
