import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from './components/Canvas';

export default function App() {
  const [format, setFormat] = useState<'16:9' | 'A4'>('16:9');
  const [selectedNode, setSelectedNode] = useState<{ html: string, tag: string } | null>(null);

  // App States
  const [isSteering, setIsSteering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Data
  const [prompt, setPrompt] = useState("");
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [html, setHtml] = useState("");
  const [attachedDocs, setAttachedDocs] = useState<{ name: string, content: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentLogs]);

  // Handle Exporters (Hitting our completed Backend routes)
  const handleExport = (type: 'pdf' | 'pptx') => {
    const url = `http://localhost:8080/api/export/${type}/demo-project-id`;
    window.open(url, '_blank');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setAgentLogs(prev => [...prev, `[System]: Prompt dispatched -> "${prompt}"`]);

    try {
      // 1. Trigger backend spawner
      await fetch('http://localhost:8080/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'demo-project-id',
          prompt,
          targetNodeHtml: selectedNode?.html,
          attachedContext: attachedDocs
        })
      });

      // 2. Connect to SSE stream
      const eventSource = new EventSource('http://localhost:8080/api/stream/demo-project-id');
      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.log) setAgentLogs(prev => [...prev, `[Rust Node]: ${data.log}`]);
          if (data.error) setAgentLogs(prev => [...prev, `[Rust Warning]: ${data.error}`]);
          if (data.complete) {
            setAgentLogs(prev => [...prev, `[System]: Compile successful. Code ${data.exitCode}`]);
            eventSource.close();
            setIsGenerating(false);
          }
        } catch (err) {
          setAgentLogs(prev => [...prev, `[Raw Stream]: ${e.data}`]);
        }
      };
      eventSource.onerror = () => {
        eventSource.close();
        setIsGenerating(false);
      };
    } catch (e) {
      setAgentLogs(prev => [...prev, `[System Error]: Node Backend Unreachable.`]);
      setIsGenerating(false);
    }
    setPrompt("");
  };

  // Node MCP Steering Handlers
  const handleSteer = async () => {
    if (!selectedNode) return;
    setIsSteering(true);
    try {
      await fetch('http://localhost:8080/api/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'apply_dom_patch', args: { slideId: 'draft', patchData: selectedNode.html } })
      });
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsSteering(false), 600);
    }
  };

  const handleSaveComponent = async () => {
    if (!selectedNode) return;
    setIsSaving(true);
    try {
      let numTokens = 0;
      const parsedHtml = selectedNode.html.replace(/>([^<]+)</g, (match, text) => {
        if (text.trim().length === 0) return match;
        numTokens++;
        return `>{{token_${numTokens}}}_str<`;
      });

      await fetch('http://localhost:8080/api/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${selectedNode.tag.toUpperCase()}_Component`, htmlPayload: parsedHtml })
      });
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsSaving(false), 600);
    }
  };

  // Document Attachment Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = await file.text();
      setAttachedDocs(prev => [...prev, { name: file.name, content: text }]);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#faf8f5] text-[#2c2b29] font-sans antialiased selection:bg-[#2c2b29] selection:text-white">

      {/* 🚀 Header: Classy Beige Minimalist */}
      <header className="h-16 border-b border-[#e8e4d9] flex items-center justify-between px-8 bg-white/50 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2c2b29] group-hover:bg-[#10b981] transition-colors duration-500 shadow-sm" />
          <h1 className="font-semibold tracking-tight text-lg text-[#2c2b29]">Deck AI</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-[#f4f1ea] p-1 rounded-full border border-[#e8e4d9]/50 shadow-inner">
            <button onClick={() => setFormat('16:9')} className={`px-5 py-1.5 rounded-full text-[11px] tracking-wider uppercase font-bold transition-all duration-300 ${format === '16:9' ? 'bg-[#2c2b29] text-[#faf8f5] shadow-md' : 'text-[#8b867c] hover:text-[#2c2b29]'}`}>
              16:9
            </button>
            <button onClick={() => setFormat('A4')} className={`px-5 py-1.5 rounded-full text-[11px] tracking-wider uppercase font-bold transition-all duration-300 ${format === 'A4' ? 'bg-[#2c2b29] text-[#faf8f5] shadow-md' : 'text-[#8b867c] hover:text-[#2c2b29]'}`}>
              A4
            </button>
          </div>

          <div className="h-6 w-px bg-[#e8e4d9]" />

          <button onClick={() => {
            const link = document.createElement('a');
            link.href = '/deckai-skill.md';
            link.download = 'deckai-skill.md';
            link.click();
          }} className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 text-[11px] uppercase tracking-wider font-bold text-[#10b981] hover:bg-[#10b981] hover:text-white transition-all duration-300 h-8">
            🔌 Add Agent Skill
          </button>

          <div className="h-6 w-px bg-[#e8e4d9]" />

          <div className="flex gap-2">
            <button onClick={() => handleExport('pdf')} className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e8e4d9] text-[11px] uppercase tracking-wider font-bold text-[#555] hover:bg-[#e8e4d9] hover:text-[#2c2b29] transition-all duration-300 h-8">
              PDF Export
            </button>
            <button onClick={() => handleExport('pptx')} className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e8e4d9] text-[11px] uppercase tracking-wider font-bold text-[#555] hover:bg-[#e8e4d9] hover:text-[#2c2b29] transition-all duration-300 h-8">
              PPTX Export
            </button>
          </div>
        </div>
      </header>

      {/* 🚀 Main Orchestration Stage */}
      <main className="flex-1 relative overflow-hidden flex">

        {/* Left Sidebar: AST Nodes & SSE Real-time Logs */}
        <aside className="w-[360px] border-r border-[#e8e4d9] bg-[#faf8f5] flex flex-col relative z-10 shadow-[8px_0_32px_rgba(0,0,0,0.02)]">

          <div className="p-8 flex-1 flex flex-col gap-8 overflow-y-auto">
            {/* Active Node Targetting */}
            <div>
              <h2 className="text-[10px] font-bold text-[#8b867c] tracking-[0.2em] uppercase mb-4 flex items-center justify-between">
                Structural Target
                <span className={`w-1.5 h-1.5 rounded-full ${selectedNode ? 'bg-[#10b981]' : 'bg-[#d1d5db]'}`} />
              </h2>
              <div className="bg-[#2c2b29] p-5 rounded-2xl shadow-xl border border-[#3e3d3b] flex flex-col gap-3 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                {selectedNode ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-[#4a4946] text-white text-[10px] font-mono select-none tracking-wider opacity-90 border border-white/10 shadow-sm">&lt;{selectedNode.tag}&gt;</span>
                    </div>
                    <div className="bg-[#1c1b1a] rounded-lg p-3 max-h-32 overflow-hidden relative shadow-inner border border-black/20">
                      <code className="text-[10px] leading-relaxed font-mono text-cyan-400 whitespace-pre-wrap break-all opacity-80">
                        {selectedNode.html.substring(0, 150)}{selectedNode.html.length > 150 ? '...' : ''}
                      </code>
                      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#1c1b1a] to-transparent" />
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <button onClick={handleSteer} disabled={isSteering} className="w-full bg-[#faf8f5] text-[#2c2b29] text-[10px] font-bold uppercase tracking-widest py-2 rounded-xl hover:bg-white transition-colors active:scale-95 shadow-sm hover:shadow">
                        {isSteering ? "Steering..." : "Isolate & Mutate"}
                      </button>
                      <button onClick={handleSaveComponent} disabled={isSaving} className="w-full border border-[#4a4946] text-[#e8e4d9] opacity-70 hover:opacity-100 text-[10px] font-bold uppercase tracking-widest py-2 rounded-xl hover:bg-[#3e3d3b] transition-all active:scale-95">
                        {isSaving ? "Saving..." : "Extract Component"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-6 flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-dashed border-[#555] flex items-center justify-center">
                      <div className="w-1 h-1 bg-[#555] rounded-full animate-pulse" />
                    </div>
                    <p className="text-[11px] text-[#8b867c] font-medium text-center">Crosshair inactive. Click any node<br />in the viewport to mount DOM.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Agent Telemetry / SSE Log Stream */}
            <div className="flex-1 flex flex-col min-h-0">
              <h2 className="text-[10px] font-bold text-[#8b867c] tracking-[0.2em] uppercase mb-3 flex items-center justify-between">
                Agent Telemetry
                <span className="text-[10px] lowercase tracking-normal bg-[#e8e4d9] text-[#2c2b29] px-2 py-0.5 rounded">sse connected</span>
              </h2>
              <div className="flex-1 bg-white border border-[#e8e4d9] rounded-2xl shadow-sm p-4 overflow-y-auto font-mono text-[10px] text-[#555] leading-relaxed relative scroll-smooth">
                {agentLogs.length === 0 ? (
                  <p className="text-[#a8a49c] italic absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">No active orchestrations...</p>
                ) : (
                  agentLogs.map((log, i) => (
                    <div key={i} className={`mb-1.5 ${log.includes('[System]') ? 'text-amber-600 font-semibold' : log.includes('Error') || log.includes('Warning') ? 'text-red-500 font-bold' : 'text-[#555]'}`}>
                      {log}
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          </div>
        </aside>

        {/* 🚀 Right Workspace: Central Scaling Canvas */}
        <section className="flex-1 relative shadow-[inset_0_0_120px_rgba(0,0,0,0.015)] bg-[#fdfbf7] flex flex-col">
          <div className="flex-1 relative max-h-full pb-24 flex items-center justify-center">

            <Canvas format={format} htmlContent={html || '<div style="width:100%; height:100%; background:#fff; margin:0;"></div>'} onNodeSelect={setSelectedNode} />

            {/* Empty State Hover Overlay */}
            {!html && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-40 pb-24">
                <div className="bg-white/70 backdrop-blur-xl px-12 py-10 rounded-[2.5rem] border border-black/5 shadow-[0_32px_64px_rgba(0,0,0,0.04)] flex flex-col items-center gap-5 transition-opacity duration-700">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-dashed border-[#e8e4d9] rounded-full animate-[spin_8s_linear_infinite]" />
                    <div className="w-3 h-3 bg-[#10b981] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-[22px] font-semibold text-[#2c2b29] tracking-tight mb-1.5">Canvas Awaiting Prompt</h1>
                    <p className="text-[#8b867c] text-[13px] font-medium tracking-wide">Instruct the agent below to initialize DOM structures.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Floating Prompt Interface (Absolute to overlay the canvas void space) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
            {attachedDocs.length > 0 && (
              <div className="flex gap-2 mb-2 px-2 overflow-x-auto">
                {attachedDocs.map((doc, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[#8b867c] border border-black/5 flex items-center shadow-sm">
                    📄 {doc.name}
                    <button onClick={() => setAttachedDocs(prev => prev.filter((_, i) => i !== idx))} className="ml-2 hover:text-red-500 font-bold">&times;</button>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-white/90 backdrop-blur-2xl border border-black/10 shadow-[0_12px_48px_rgba(0,0,0,0.08)] rounded-3xl p-2.5 flex items-center gap-3 relative transition-all duration-300 focus-within:shadow-[0_16px_64px_rgba(0,0,0,0.12)] focus-within:ring-2 focus-within:ring-[#10b981]/20 focus-within:-translate-y-1">
              {/* Context indicator / Document Uploader */}
              <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".txt,.md,.json,.csv,.html" />
              <button
                onClick={() => {
                  if (!selectedNode) fileInputRef.current?.click();
                }}
                className={`shrink-0 ml-3 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${selectedNode ? 'bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] cursor-default' : 'bg-[#f4f1ea] border border-[#e8e4d9] text-[#8b867c] hover:bg-[#e8e4d9] cursor-pointer'}`}
                title={selectedNode ? "Steering Active" : "Attach Reference Document"}
              >
                {selectedNode ? '@' : '#'}
              </button>

              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder={selectedNode ? `Instruct agent to mutate <${selectedNode.tag}>...` : "Prompt DeckAI (e.g. Generate a dark-mode pricing slide)..."}
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#2c2b29] placeholder:text-[#a8a49c] font-medium tracking-wide"
                disabled={isGenerating}
              />

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="shrink-0 bg-[#2c2b29] text-white h-10 px-6 rounded-2xl text-[11px] uppercase tracking-widest font-bold hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:hover:bg-[#2c2b29] active:scale-95 shadow-md flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.1s]" />
                  </>
                ) : 'Generate'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
