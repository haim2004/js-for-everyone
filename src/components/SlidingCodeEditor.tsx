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
        <div className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[800px] bg-[#1e1e1e] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-40 flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
            <div className="h-16 px-6 bg-[#252526] border-b border-gray-800 flex items-center justify-between text-gray-300 shrink-0">
                <div className="flex items-center gap-3">
                    <TerminalSquare className="w-5 h-5 text-indigo-400" />
                    <span className="font-medium tracking-wide">עורך הקוד שלך</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 relative min-h-0">
                 <CodeRunner />
            </div>
        </div>
    );
}
