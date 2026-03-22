import React, { useState } from 'react';
import { Canvas } from './components/Canvas';

export default function App() {
  const [format, setFormat] = useState<'16:9' | 'A4'>('16:9');
  const [selectedNode, setSelectedNode] = useState<{ html: string, tag: string } | null>(null);
  const [html, setHtml] = useState('<div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #fdfbf7 0%, #e8e4d9 100%);"><h1 style="color: #2c2b29; font-size: 82px; letter-spacing: -2px; font-weight: 500; margin: 0;">Deck AI Canvas Ready</h1><p style="color: #8b867c; font-size: 24px; margin-top: 16px;">Hover over any element here to steer.</p></div>');

  return (
    <div className="w-screen h-screen flex flex-col bg-[#faf8f5] text-[#2c2b29] font-sans antialiased">
      {/* Header: Classy Beige/Ivory Minimalist Aesthetic */}
      <header className="h-16 border-b border-[#e8e4d9] flex items-center justify-between px-8 bg-white/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2c2b29] animate-pulse" />
          <h1 className="font-semibold tracking-tight text-lg">Deck AI</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setFormat('16:9')}
            className={`px-5 py-1.5 rounded-full text-xs tracking-wider uppercase font-semibold transition-all duration-300 ${format === '16:9' ? 'bg-[#2c2b29] text-[#faf8f5] shadow-lg' : 'bg-[#e8e4d9] text-[#8b867c] hover:bg-[#dfdcd1]'}`}
          >
            16:9 Presentation
          </button>
          <button
            onClick={() => setFormat('A4')}
            className={`px-5 py-1.5 rounded-full text-xs tracking-wider uppercase font-semibold transition-all duration-300 ${format === 'A4' ? 'bg-[#2c2b29] text-[#faf8f5] shadow-lg' : 'bg-[#e8e4d9] text-[#8b867c] hover:bg-[#dfdcd1]'}`}
          >
            A4 Document
          </button>
        </div>
      </header>

      {/* Main Stage */}
      <main className="flex-1 relative overflow-hidden flex">
        {/* Left Sidebar: Orchestration Controls Placeholder */}
        <aside className="w-[340px] border-r border-[#e8e4d9] bg-[#faf8f5] p-8 flex flex-col gap-6 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div>
            <h2 className="text-[10px] font-bold text-[#8b867c] tracking-[0.2em] uppercase mb-4">MCP Agent Connection</h2>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#e8e4d9] flex flex-col gap-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-xs font-semibold text-[#2c2b29]">/api/mcp/tools Active</p>
              </div>
              <p className="text-xs text-[#8b867c] leading-relaxed">Agent Mob logic loop standing by. Double click canvas nodes to steer the layout.</p>
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-bold text-[#8b867c] tracking-[0.2em] uppercase mb-4 mt-4">Active Selection</h2>
            <div className="bg-[#2c2b29] p-5 rounded-2xl shadow-lg border border-[#3e3d3b] flex flex-col gap-3">
              {selectedNode ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#4a4946] text-[#e8e4d9] text-[10px] font-mono select-none">&lt;{selectedNode.tag}&gt;</span>
                    <p className="text-xs font-semibold text-white">Target Acquired</p>
                  </div>
                  <div className="bg-[#1c1b1a] rounded-lg p-3 max-h-40 overflow-hidden relative">
                    <code className="text-[10px] font-mono text-cyan-400 whitespace-pre-wrap break-all opacity-80">
                      {selectedNode.html.substring(0, 150)}{selectedNode.html.length > 150 ? '...' : ''}
                    </code>
                    <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#1c1b1a] to-transparent" />
                  </div>
                  <button className="w-full mt-2 bg-white text-[#2c2b29] text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl hover:bg-[#f4f1ea] transition-colors active:scale-95">
                    Steer Component
                  </button>
                </>
              ) : (
                <p className="text-xs text-[#8b867c] italic text-center py-6">Crosshair inactive. Hover & click a node in the viewport.</p>
              )}
            </div>
          </div>
        </aside>

        {/* Right Workspace: Scaleable Canvas */}
        <section className="flex-1 relative shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]">
          <Canvas format={format} htmlContent={html} onNodeSelect={setSelectedNode} />
        </section>
      </main>
    </div>
  );
}
