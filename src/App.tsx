import React, { useState } from 'react';
import { Home } from './screens/Home';
import { Course } from './screens/Course';
import { FloatingChat } from './components/FloatingChat';
import { SlidingCodeEditor } from './components/SlidingCodeEditor';
import { TerminalSquare } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'course'>('home');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-50 font-sans" dir="rtl">
        {currentScreen === 'home' && (
            <Home onStart={() => setCurrentScreen('course')} />
        )}

        {currentScreen === 'course' && (
            <>
                <Course onOpenEditor={() => setIsEditorOpen(true)} />
                <FloatingChat />
                <SlidingCodeEditor isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
                
                {/* Floating button to open code editor if it's closed */}
                {!isEditorOpen && (
                    <button
                        onClick={() => setIsEditorOpen(true)}
                        className="fixed bottom-24 left-6 z-40 bg-slate-800 text-white shadow-lg flex items-center gap-2 px-4 py-3 rounded-full hover:bg-slate-700 transition-colors pointer-events-auto"
                    >
                        <TerminalSquare className="w-5 h-5" />
                        <span className="font-medium">פתח עורך קוד</span>
                    </button>
                )}
            </>
        )}
    </div>
  );
}
