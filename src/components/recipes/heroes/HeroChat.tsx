import { motion } from 'framer-motion'
import { ChatInterface } from '../ai/ChatInterface'
import { GradientBackground } from '../effects/GradientBackground'
import { ChatMessageProps } from '../ai/ChatMessage'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'

interface HeroChatProps {
  title: string
  subtitle: string
}

export function HeroChat({ title, subtitle }: HeroChatProps) {
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your Market Scout agent. Describe your ideal startup opportunity (e.g., 'Low competition SaaS in healthcare'), and I'll help you find matching trends.",
      timestamp: new Date().toLocaleTimeString(),
    }
  ])

  const handleSendMessage = (text: string) => {
    // User message
    const userMsg: ChatMessageProps = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    }
    setMessages(prev => [...prev, userMsg])

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "That's a great angle! Based on your criteria, 'Personalized Longevity Protocols' and 'Mental Health Biomarkers' show strong signal. Check out the cards below for details on TAM and growth.",
        timestamp: new Date().toLocaleTimeString(),
      }])
    }, 1000)
  }

  return (
    <section className="relative pt-24 pb-32 px-4 overflow-hidden">
      <GradientBackground variant="radial" className="opacity-50" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center lg:text-left space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Research</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {title}
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
            {subtitle}
          </p>
        </motion.div>

        {/* Right: Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:ml-auto"
        >
          <div className="relative">
            {/* Glow effect behind chat */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20" />
            
            <ChatInterface 
              messages={messages}
              onSendMessage={handleSendMessage}
              placeholder="Ask about a market trend..."
              suggestedPrompts={["High growth SaaS", "Undervalued AI niches"]}
              className="h-[450px] shadow-2xl border-border/50 bg-background/80 backdrop-blur-xl"
            />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
