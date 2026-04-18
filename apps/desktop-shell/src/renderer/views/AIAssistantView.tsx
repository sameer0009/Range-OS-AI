import { useState, useRef, useEffect } from 'react';
import { Card, Badge, Button } from '@rangeos/ui';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Terminal as TerminalIcon, 
  FileText, 
  Database,
  ArrowRight,
  ShieldCheck,
  User,
  Paperclip,
  Trash2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: any[];
  timestamp: string;
}

const AGENTS = [
  { id: 'tutor', name: 'Range Tutor', icon: <Bot size={16} /> },
  { id: 'architect', name: 'Lab Architect', icon: <ShieldCheck size={16} /> },
  { id: 'analyst', name: 'Forensic Analyst', icon: <Database size={16} /> },
  { id: 'writer', name: 'Report Writer', icon: <FileText size={16} /> },
];

export default function AIAssistantView() {
  const [activeAgent, setActiveAgent] = useState('analyst');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Neural Link established. I am ready to analyze system telemetry or assist with mission strategy. How can I help today?', 
      timestamp: '19:21' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock API Call Simulation
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Intelligence synthesized for agent profile: ${activeAgent.toUpperCase()}. I recommend auditing the current DC policy as unusual lateral movement has been detected in segment 10.0.1.0/24.`,
        suggestions: [
          { id: 's1', label: 'AUDIT DC POLICY', action: 'policy audit --target dc-01' },
          { id: 's2', label: 'ISOLATE SEGMENT', action: 'network isolate 10.0.1.0/24' }
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex h-full max-w-[1600px] mx-auto overflow-hidden gap-6 p-2">
      
      {/* Column 1: Agent Selector (20%) */}
      <div className="w-64 flex flex-col gap-6">
        <div className="space-y-4">
          <h2 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest px-2">Active Intelligence</h2>
          <div className="space-y-1">
            {AGENTS.map(agent => (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(agent.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs transition-all ${
                  activeAgent === agent.id 
                    ? 'bg-cyber-primary text-black font-bold shadow-glow-primary' 
                    : 'text-gray-400 hover:bg-cyber-surface-elevated/50 hover:text-white'
                }`}
              >
                {agent.icon}
                <span className="uppercase tracking-widest">{agent.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Card className="border-dashed border-cyber-surface-elevated bg-transparent text-center p-6 space-y-2">
            <Bot size={24} className="mx-auto text-gray-700" />
            <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Neural core operating at 94% efficiency</p>
          </Card>
        </div>
      </div>

      {/* Column 2: Chat Core (55%) */}
      <div className="flex-1 flex flex-col bg-cyber-surface/30 border border-cyber-surface-elevated rounded-xl overflow-hidden backdrop-blur-sm">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-surface-elevated bg-cyber-surface/50">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-white uppercase tracking-[0.2em]">{activeAgent} Intelligence Link Active</span>
           </div>
           <Button variant="ghost" size="sm" className="text-gray-500 hover:text-cyber-alert">
              <Trash2 size={14} />
           </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'assistant' ? 'items-start' : 'items-start flex-row-reverse'}`}>
              <div className={`p-2 rounded-lg ${msg.role === 'assistant' ? 'bg-cyber-primary text-black' : 'bg-cyber-surface-elevated text-white'}`}>
                {msg.role === 'assistant' ? <Sparkles size={16} /> : <User size={16} />}
              </div>
              <div className={`max-w-[80%] space-y-2 ${msg.role === 'assistant' ? '' : 'text-right'}`}>
                <div className={`p-4 rounded-2xl text-sm font-mono leading-relaxed shadow-lg ${
                  msg.role === 'assistant' 
                    ? 'bg-cyber-surface/80 border border-cyber-surface-elevated text-gray-200' 
                    : 'bg-cyber-primary/10 border border-cyber-primary/30 text-white'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[9px] font-mono text-gray-600 uppercase">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 items-center animate-pulse">
               <div className="p-2 rounded-lg bg-cyber-primary text-black opacity-50"><Sparkles size={16} /></div>
               <div className="h-4 w-24 bg-cyber-surface-elevated rounded-full" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-cyber-surface/50 border-t border-cyber-surface-elevated">
           <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-xl blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
              <div className="relative flex items-center gap-2 bg-cyber-background border border-cyber-surface-elevated rounded-xl p-2 pl-4">
                 <Button variant="ghost" size="sm" className="px-2 text-gray-500 hover:text-white">
                    <Paperclip size={18} />
                 </Button>
                 <input 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Type mission directives or system queries..."
                   className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-mono text-white placeholder:text-gray-700"
                 />
                 <Button variant="primary" onClick={handleSend} disabled={!input.trim()} className="rounded-lg h-10 w-10 p-0">
                    <Send size={18} />
                 </Button>
              </div>
           </div>
        </div>
      </div>

      {/* Column 3: Tactical Panel (25%) */}
      <div className="w-80 flex flex-col gap-6">
        
        {/* Artifacts Area */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest px-2">Knowledge Context</h2>
          <div className="p-8 border border-dashed border-cyber-surface-elevated rounded-xl flex flex-col items-center text-center space-y-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
              <Paperclip size={24} className="text-gray-700" />
              <p className="text-[10px] font-mono text-gray-600 uppercase">Drop telemetry or evidence to enrich intelligence</p>
          </div>
        </section>

        {/* Suggested Actions */}
        <section className="flex-1 flex flex-col gap-4 overflow-hidden">
          <h2 className="text-[10px] font-mono font-bold text-cyber-primary uppercase tracking-widest px-2 animate-pulse">Tactical Suggestions</h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.filter(m => m.suggestions).pop()?.suggestions?.map(sug => (
              <Card key={sug.id} className="group border-cyber-primary/20 hover:border-cyber-primary/50 cursor-pointer transition-all active:scale-95">
                <div className="flex justify-between items-start mb-2">
                   <div className="p-1 px-2 rounded bg-cyber-primary/10 text-[9px] font-bold text-cyber-primary uppercase tracking-tighter">AI SUGGESTION</div>
                   <ArrowRight size={14} className="text-gray-700 group-hover:text-cyber-primary transition-colors" />
                </div>
                <h4 className="text-[11px] font-mono font-bold text-white uppercase mb-1">{sug.label}</h4>
                <div className="bg-black/50 p-2 rounded font-mono text-[9px] text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                   {sug.action}
                </div>
                <div className="mt-3 flex justify-end">
                   <span className="text-[9px] font-bold text-cyber-primary group-hover:underline uppercase underline-offset-4">Commit Action →</span>
                </div>
              </Card>
            ))}
            {!messages.filter(m => m.suggestions).length && (
              <p className="text-[10px] font-mono text-gray-700 italic px-2 text-center mt-10">Intelligence core analyzing telemetry for actionable patterns...</p>
            )}
          </div>
        </section>

      </div>

    </div>
  );
}
