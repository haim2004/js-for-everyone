import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play } from 'lucide-react';

export function CodeRunner() {
  const [code, setCode] = useState('// כתוב את הקוד שלך כאן...\n\nconsole.log("שלום עולם!");\n');
  const [output, setOutput] = useState<string[]>([]);

  const runCode = () => {
    setOutput([]);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Override console.log in the iframe
    const script = iframe.contentWindow?.document.createElement('script');
    if (script) {
        script.textContent = `
          const originalLog = console.log;
          console.log = (...args) => {
            const msg = args.map(a => {
              if (typeof a === 'object') {
                try {
                   return JSON.stringify(a, null, 2);
                } catch(e) {
                   return String(a);
                }
              }
              return String(a);
            }).join(' ');
            window.parent.postMessage({ type: 'console', log: msg }, '*');
            originalLog(...args);
          };
          
          const originalError = console.error;
          console.error = (...args) => {
            const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
            window.parent.postMessage({ type: 'error', error: msg }, '*');
            originalError(...args);
          }
          
          window.onerror = function(message, source, lineno, colno, error) {
            window.parent.postMessage({ type: 'uncaught', error: message }, '*');
            return true;
          };
          
          try {
             ${code}
          } catch(e) {
             window.parent.postMessage({ type: 'error', error: e.toString() }, '*');
          }
        `;
        iframe.contentWindow?.document.body.appendChild(script);
    }
    
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 100);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        setOutput(prev => [...prev, event.data.log]);
      } else if (event.data?.type === 'error' || event.data?.type === 'uncaught') {
        setOutput(prev => [...prev, `[שגיאה] ${event.data.error}`]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
      <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-gray-800" dir="ltr">
         <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#252526]">
            <div className="flex items-center gap-2 text-gray-300 font-mono text-sm">
                <span className="text-yellow-400">JS</span> editor.js
            </div>
            <button 
                onClick={runCode} 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors cursor-pointer shadow-sm"
             >
                <Play className="w-4 h-4" />
                <span>Run Code</span>
            </button>
         </div>
         <div className="flex-1 min-h-[50%] relative">
            <Editor
               height="100%"
               language="javascript"
               theme="vs-dark"
               value={code}
               onChange={(val) => setCode(val || '')}
               options={{
                 minimap: { enabled: false },
                 fontSize: 15,
                 fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                 padding: { top: 16 },
               }}
            />
         </div>
         <div className="h-1/3 flex flex-col border-t border-gray-800 bg-[#1e1e1e]">
            <div className="px-4 py-2 border-b border-gray-800 bg-[#252526] text-gray-400 text-xs uppercase tracking-wider font-semibold">
                Console Output
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-gray-300">
                {output.map((line, i) => (
                    <div key={i} className={`py-1 border-b border-gray-800/50 last:border-0 ${line.startsWith('[שגיאה]') ? 'text-red-400' : 'text-green-400'}`}>
                        {line}
                    </div>
                ))}
                {output.length === 0 && <span className="text-gray-500 italic">No output yet. Click 'Run Code' to execute.</span>}
            </div>
         </div>
      </div>
  )
}
