import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const EVENT_CONTEXT = `
You are the official AI assistant for CHED RAISE 2025 (National Industry–Academe Collaborative Conference).
Your role is to answer inquiries ONLY about this event.
If a user asks about anything else, politely decline and steer them back to the event.
Keep your answers concise, friendly, and professional.

Event Details:
- Name: CHED RAISE 2025
- Full Name: National Industry–Academe Collaborative Conference
- Theme: Responding through AI for Societal Empowerment
- Date: January 28-30, 2026
- Venue: Iloilo Convention Center, Iloilo City
- Registration Link: /login
- Key Topics: Connecting ASEAN Through Knowledge & Play, Building a Future-Ready Region.
`;

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'model',
            content: "Hi! I'm the CHED RAISE AI assistant. Ask me anything about the conference!"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            if (!import.meta.env.VITE_GEMINI_API_KEY) {
                throw new Error("API Key not configured");
            }

            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: EVENT_CONTEXT
            });

            const chat = model.startChat({
                history: messages
                    .filter(m => m.id !== 'welcome') // Filter out welcome message if needed or keep it if it helps context, but usually chat history prefers proper role structure. api expects 'user' or 'model'.
                    .map(m => ({
                        role: m.role,
                        parts: [{ text: m.content }]
                    }))
            });

            const result = await chat.sendMessage(userMessage.content);
            const response = await result.response;
            const text = response.text();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: text
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again later or check your API key."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-4 z-50 w-[90vw] md:w-[400px] shadow-2xl"
                    >
                        <Card className="border-white/10 bg-slate-950/70 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-[600px] rounded-3xl">
                            <CardHeader className="p-4 border-b border-white/10 bg-white/5 flex flex-row items-center justify-between space-y-0 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 shadow-inner">
                                        <img src="/r-icon.svg" alt="R Icon" className="w-6 h-6 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-bold text-white tracking-wide">RAISE Assistant</CardTitle>
                                        <p className="text-[10px] uppercase tracking-wider text-blue-200/70 font-medium">Event Guide</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none" />
                                <div
                                    className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth"
                                    ref={scrollRef}
                                >
                                    {messages.map((msg) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={msg.id}
                                            className={cn(
                                                "flex gap-3 max-w-[85%]",
                                                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg border border-white/10",
                                                msg.role === 'user'
                                                    ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"
                                                    : "bg-slate-800/80 backdrop-blur-sm"
                                            )}>
                                                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-300" />}
                                            </div>
                                            <div className={cn(
                                                "p-3.5 rounded-2xl text-sm shadow-md backdrop-blur-md",
                                                msg.role === 'user'
                                                    ? "bg-gradient-to-br from-blue-600/90 to-indigo-600/90 text-white border border-blue-400/20 rounded-tr-sm"
                                                    : "bg-white/5 text-slate-100 border border-white/10 rounded-tl-sm"
                                            )}>
                                                <p className="leading-relaxed">{msg.content}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3 max-w-[85%] mr-auto">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-800/80 border border-white/10 shadow-lg">
                                                <Bot className="w-4 h-4 text-blue-300" />
                                            </div>
                                            <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 text-sm shadow-md flex items-center gap-2">
                                                <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                                                <span className="text-slate-400 text-xs font-medium">Thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="p-3 pb-4 border-t border-white/10 bg-slate-950/30 backdrop-blur-lg">
                                <div className="flex w-full items-center gap-2 bg-slate-900/50 p-1.5 rounded-full border border-white/10 focus-within:border-blue-500/50 focus-within:bg-slate-900/80 transition-all duration-300 shadow-inner">
                                    <Input
                                        placeholder="Ask about CHED RAISE..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none text-slate-100 placeholder:text-slate-500 h-10 px-4"
                                        ref={inputRef}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className="shrink-0 rounded-full h-9 w-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-600/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Button
                        size="lg"
                        className={cn(
                            "h-16 w-16 rounded-full shadow-[0_0_30px_rgba(8,52,159,0.3)] transition-all duration-500 hover:scale-105 border border-white/20 backdrop-blur-md",
                            isOpen
                                ? "bg-slate-900/80 text-white hover:bg-slate-800 rotate-90"
                                : "bg-gradient-to-br from-[#08349f] via-blue-700 to-indigo-800 text-white hover:shadow-[0_0_50px_rgba(8,52,159,0.5)]"
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className="h-7 w-7" />
                        ) : (
                            <MessageCircle className="h-7 w-7" />
                        )}
                    </Button>
                    {!isOpen && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-slate-900"></span>
                        </span>
                    )}
                </div>
            </motion.div>
        </>
    );
}
