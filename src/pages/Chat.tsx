import { useState, useRef, useEffect } from 'react';
import { ChatInterface } from '../components/recipes/ai/ChatInterface';
import { ChatMessageProps } from '../components/recipes/ai/ChatMessage';
import { MOCK_TRENDS } from '../data/mockTrends';
import { TrendCard } from '../components/TrendCard';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/card';

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
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => setIsListening(false);
    }
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
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthesisRef.current.speak(utterance);
  };

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
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

      // If trends are recommended, add a special "System" message to render cards
      if (data.recommendedTrendIds && data.recommendedTrendIds.length > 0) {
        const recommendedCards = MOCK_TRENDS.filter(t => data.recommendedTrendIds.includes(t.id));
        
        if (recommendedCards.length > 0) {
          setMessages(prev => [...prev, {
            role: 'data', // Custom role for UI rendering
            content: JSON.stringify(recommendedCards),
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
        status: 'error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Custom renderer for the message list to support "Rich UI" (Cards)
  const renderMessageList = () => {
    return messages.map((msg, idx) => {
      if (msg.role === 'data') {
        const trends = JSON.parse(msg.content);
        return (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4 pl-4 md:pl-12"
          >
            {trends.map((t: any) => (
              <div key={t.id} className="scale-90 origin-top-left">
                <TrendCard trend={t} />
              </div>
            ))}
          </motion.div>
        );
      }
      return <ChatMessageProps key={idx} {...msg} />; 
      // Note: We need to use the actual ChatMessage component here, 
      // but ChatInterface encapsulates the mapping. 
      // We will need to customize ChatInterface or use a custom list here.
      // For MVP speed, let's wrap ChatInterface but we need to inject the custom rendering logic 
      // OR pass a custom component map. 
      // Since ChatInterface is from the boilerplate, let's just use it for text 
      // and inject the cards as a separate "message" type if supported, 
      // OR easier: Build a custom chat view here reusing components.
    });
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
            variant={isSpeaking ? "destructive" : "ghost"} 
            size="icon" 
            onClick={stopSpeaking}
            disabled={!isSpeaking}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-muted-foreground" />}
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
          messages={messages.filter(m => m.role !== 'data')} // Hide raw data messages from standard view
          onSendMessage={handleSendMessage}
          loading={loading}
          enableVoice={true} // We have custom voice controls, but this enables the input icon too
          className="h-full border-none rounded-none shadow-none"
          // We need to inject the Rich UI cards. 
          // Since ChatInterface doesn't easily support custom renderers without modifying it,
          // Let's modify the ChatInterface to accept a 'renderMessage' prop OR 
          // simpler: We modify ChatMessage to handle 'data' role? 
          // For now, let's stick to standard text and I'll modify the ChatInterface component to handle 'data' role.
        />
        
        {/* Overlay for Cards (Hack for MVP to show cards at bottom if they exist) */}
        {messages[messages.length - 1]?.role === 'data' && (
           <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
              <div className="max-w-4xl mx-auto">
                 <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Recommended Trends</div>
                 <div className="flex gap-4 overflow-x-auto pb-4">
                    {JSON.parse(messages[messages.length - 1].content).map((t: any) => (
                      <div key={t.id} className="min-w-[300px]">
                        <TrendCard trend={t} />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
