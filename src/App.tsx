import React, { useState } from 'react';
import { Home } from './screens/Home';
import { Course } from './screens/Course';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'course'>('home');

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-slate-50 font-sans overflow-hidden" dir="rtl">
        {currentScreen === 'home' && (
            <Home onStart={() => setCurrentScreen('course')} />
        )}

        {currentScreen === 'course' && (
            <div className="flex-1 flex flex-col min-h-0 relative">
                <Course />
            </div>
        )}
    </div>
  );
}
