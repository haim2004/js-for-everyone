import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Sparkles, Loader2, X, MessageCircle } from 'lucide-react';

interface ChatMessage {
    id: string;
    sender: 'user' | 'mentor';
    text: string;
}

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const initChat = async () => {
        if (messages.length > 0) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: [], message: 'היי, אפשר עזרה עם הקורס?' })
            });
            const data = await response.json();
            if (response.ok && !data.error) {
                setMessages([{ id: Date.now().toString(), sender: 'mentor', text: data.text }]);
            } else {
                setMessages([{ id: 'error', sender: 'mentor', text: data.error || 'שגיאה בהתחברות לשרת ה-AI.' }]);
            }
        } catch (e) {
            setMessages([{ id: 'error', sender: 'mentor', text: 'שגיאה בהתחברות לשרת ה-AI. אנא בדוק הגדרות מפתח API.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChat = () => {
        if (!isOpen) {
            initChat();
        }
        setIsOpen(!isOpen);
    };

    const sendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        const currentMessages = [...messages, userMsg];
        setMessages(currentMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: currentMessages.slice(0, -1),
                    message: userMsg.text
                })
            });
            const data = await response.json();
            if (response.ok && !data.error) {
                setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'mentor', text: data.text }]);
            } else {
                setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'mentor', text: data.error || 'שגיאה. אנא נסה שוב.' }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'mentor', text: 'שגיאה בחיבור למנטור.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start" dir="rtl">
            {isOpen && (
                <div className="bg-white rounded-3xl shadow-2xl w-full sm:w-[400px] h-[550px] mb-4 border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-indigo-300" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-wide">מנטור AI מומחה</h3>
                                <p className="text-xs text-indigo-200">שאל אותי הכל על JavaScript</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-300" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 custom-scrollbar relative">
                        {messages.length === 0 && isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-50">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-100 rounded-bl-none'}`}>
                                    {msg.sender === 'mentor' ? (
                                        <div className="prose prose-sm prose-slate max-w-none prose-headings:text-indigo-900 prose-a:text-indigo-600 prose-code:text-indigo-600 prose-pre:bg-slate-800 prose-pre:text-white">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap">{msg.text}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && messages.length > 0 && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-4 shadow-sm text-slate-500">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                        <form onSubmit={sendMessage} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="שאל שאלה..."
                                className="w-full rounded-full border border-slate-200 py-3 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute left-1.5 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-4 h-4 rtl:-scale-x-100" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <button
                onClick={toggleChat}
                className="w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all text-white group"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />}
            </button>
        </div>
    );
}
