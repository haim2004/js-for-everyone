import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Sparkles, Loader2, BookOpen, Layers, TerminalSquare, MessageCircle } from 'lucide-react';
import { CodeRunner } from './components/CodeRunner';

interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'editor'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    startCourse();
  }, []);

  const startCourse = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: [] })
        });
        const data = await response.json();
        if (response.ok && !data.error) {
            setMessages([{ id: Date.now().toString(), sender: 'mentor', text: data.text }]);
        } else {
            setMessages([{ id: 'error', sender: 'mentor', text: data.error || 'שגיאה בהתחברות לשרת ה-AI. אנא נסה שוב.' }]);
        }
    } catch (e) {
        setMessages([{ id: 'error', sender: 'mentor', text: 'שגיאה בהתחברות לשרת ה-AI. אנא נסה שוב.' }]);
    } finally {
        setIsLoading(false);
    }
  }

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
                history: currentMessages.slice(0, -1), // Everything before this message
                message: userMsg.text
            })
        });
        const data = await response.json();
        if (response.ok && !data.error) {
           setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'mentor', text: data.text }]);
        } else {
           setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'mentor', text: data.error || 'שגיאה בחיבור למנטור, נסה שוב.' }]);
        }
    } catch (e) {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'mentor', text: 'שגיאה בחיבור למנטור, נסה שוב.' }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-50 font-sans" dir="rtl">
      {/* Sidebar Syllabus */}
      <div className="hidden xl:flex w-72 bg-slate-900 border-l border-slate-800 text-slate-300 flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3 shrink-0">
           <Layers className="w-8 h-8 text-indigo-400" />
           <h1 className="text-xl font-bold text-white tracking-tight">JS Masterclass</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
           {syllabus.map((chk, i) => (
             <div key={chk.title}>
               <h3 className="font-semibold text-indigo-300 text-sm mb-3 uppercase tracking-wider">{chk.title}</h3>
               <ul className="space-y-2">
                 {chk.items.map((item, j) => (
                   <li key={item} className="text-sm text-slate-400 hover:text-slate-100 transition-colors flex items-start gap-2 cursor-default">
                     <div className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 shrink-0"></div>
                     <span className="leading-snug">{item}</span>
                   </li>
                 ))}
               </ul>
             </div>
           ))}
        </div>
      </div>

      {/* Main Content Area (Mobile Tabs included) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 md:flex-row shadow-2xl relative z-10 bg-white">
          
         {/* Mobile Tab Navigation */}
         <div className="md:hidden flex bg-white border-b border-slate-200 shrink-0">
            <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
            >
                <MessageCircle className="w-4 h-4" /> צ'אט עם המנטור
            </button>
            <button 
                onClick={() => setActiveTab('editor')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'editor' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
            >
                <TerminalSquare className="w-4 h-4" /> עורך קוד
            </button>
         </div>

         {/* Mentor Chat Area */}
         <div className={`flex-1 flex-col min-w-0 md:flex md:w-1/2 md:border-l md:border-slate-200 bg-white ${activeTab === 'chat' ? 'flex' : 'hidden'}`}>
             <div className="h-16 px-4 md:px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                     <Sparkles className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 leading-tight">מנטור AI מומחה</h2>
                    <span className="text-xs text-slate-500">פעיל וישמח לעזור</span>
                  </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50/50 relative custom-scrollbar">
               {messages.length === 0 && !isLoading && (
                 <div className="absolute inset-0 flex items-center justify-center">
                     <div className="text-center text-slate-400 flex flex-col items-center gap-2">
                         <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                         <span>מכין את מערך השיעור הראשון...</span>
                     </div>
                 </div>
               )}
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[90%] md:max-w-[85%] rounded-2xl p-4 md:p-5 shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-100 rounded-bl-none'}`}>
                     {msg.sender === 'mentor' ? (
                       <div className="prose prose-sm md:prose-base prose-slate max-w-none text-slate-800 prose-headings:text-indigo-900 prose-a:text-indigo-600 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:max-w-[200px] sm:prose-pre:max-w-full overflow-x-auto">
                         <ReactMarkdown>{msg.text}</ReactMarkdown>
                       </div>
                     ) : (
                       <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</div>
                     )}
                   </div>
                 </div>
               ))}
               {isLoading && (
                   <div className="flex justify-start">
                      <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-5 shadow-sm text-slate-500 w-auto">
                         <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0ms'}}></span>
                            <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '150ms'}}></span>
                            <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '300ms'}}></span>
                         </div>
                      </div>
                   </div>
               )}
               <div ref={messagesEndRef} />
             </div>

             <div className="p-3 md:p-6 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={sendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="כתוב הודעה למנטור, שאלות או קוד..."
                    className="w-full rounded-2xl border border-slate-200 py-3 md:py-4 px-4 md:px-6 pl-14 md:pl-14 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 text-slate-800 transition-all text-sm md:text-base font-medium placeholder:text-slate-400 placeholder:font-normal"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute left-2 p-2.5 md:p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 md:w-5 md:h-5 rtl:rotate-180" />
                  </button>
                </form>
             </div>
         </div>

         {/* Code Editor */}
         <div className={`w-full md:w-1/2 flex-col bg-[#1e1e1e] ${activeTab === 'editor' ? 'flex' : 'hidden md:flex'}`}>
            <CodeRunner />
         </div>
      </div>
    </div>
  );
}

const syllabus = [
  {
    title: 'פרק 1: יסודות השפה',
    items: ['ברוכים הבאים ל-JavaScript', 'משתנים וסוגי נתונים', 'אופרטורים בסיסיים', 'תנאים והחלטות', 'לולאות (For, While)', 'קצת על פונקציות', 'תרגול מסכם']
  },
  {
    title: 'פרק 2: מבני נתונים',
    items: ['מערכים (Arrays)', 'אובייקטים (Objects)', 'מתודות: map', 'מתודות: filter', 'מתודות: reduce', 'Destructuring & Spread', 'תרגול מסכם']
  },
  {
    title: 'פרק 3: פונקציות ו-Scope',
    items: ['פונקציות חץ', 'איך Scope עובד', 'מה זה Closures?', 'איך Hoisting עובד', 'מילת המפתח this', 'תרגול מסכם']
  },
  {
    title: 'פרק 4: אסינכרוניות',
    items: ['מבוא ל-Event Loop', 'מהם Callbacks?', 'הבטחות (Promises)', 'שימוש ב-Async/Await', 'טיפול בשגיאות', 'תרגול מסכם']
  },
  {
    title: 'פרק 5: דפדפן (DOM)',
    items: ['בחירת אלמנטים', 'שינוי תוכן וסגנונות', 'האזנה לאירועים', 'שמירת נתונים מקומית', 'קריאות רשת (Fetch)', 'תרגול מסכם']
  },
  {
    title: 'פרק 6: ארכיטקטורה',
    items: ['מחלקות ו-OOP', 'מודולים', 'Clean Code Guidelines', 'תבניות עיצוב', 'הכנה ל-React/Next.js', 'פרויקט גמר']
  }
];
