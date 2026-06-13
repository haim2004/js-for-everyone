import React from 'react';
import { CodeRunner } from './CodeRunner';
import { TerminalSquare, X } from 'lucide-react';

interface CodePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SlidingCodeEditor({ isOpen, onClose }: CodePanelProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 left-0 w-full md:w-[500px] lg:w-[600px] xl:w-[800px] bg-[#1e1e1e] shadow-[10px_0_40px_rgba(0,0,0,0.5)] z-[60] flex flex-col transform transition-transform animate-in slide-in-from-left duration-300 border-r border-gray-800" dir="rtl">
            <div className="h-16 px-4 md:px-6 bg-[#252526] border-b border-gray-800 flex items-center justify-between text-gray-300 shrink-0 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                    <TerminalSquare className="w-5 h-5 text-indigo-400 shrink-0" />
                    <span className="font-medium tracking-wide text-sm md:text-base truncate">עורך קוד אישי לתרגול ולמידה</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0 group">
                    <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
            </div>
            {/* The CodeRunner internally renders its own setup which is dir="ltr" where needed */}
            <div className="flex-1 relative min-h-0 bg-[#1e1e1e]">
                 <CodeRunner />
            </div>
        </div>
    );
}
