import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from './components/Canvas';
import { Undo2, Redo2, MousePointer2, Pen, Eraser, Library, X, Plug, ChevronDown, Download, FileText, Presentation, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function App() {
  const [format, setFormat] = useState<'16:9' | 'A4'>('16:9');
  const [selectedNode, setSelectedNode] = useState<{ html: string, tag: string } | null>(null);
  const [activeTool, setActiveTool] = useState<'Select' | 'Draw' | 'Erase'>('Select');

  // History Stack
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);

  // App States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSteering, setIsSteering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Data
  const [prompt, setPrompt] = useState("");
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [html, setHtml] = useState("");
  const [attachedDocs, setAttachedDocs] = useState<{ name: string, content: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Menu States
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [installedAgents, setInstalledAgents] = useState<Record<string, boolean>>({
    'Codex': false, 'Kiro': false, 'Claude Code': false, 'Gemini': false, 'Opencode': false
  });

  // Library Modal State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryComponents, setLibraryComponents] = useState<any[]>([]);

  const loadLibrary = async () => {
    setIsLibraryOpen(true);
    try {
      const res = await fetch('http://localhost:8080/api/components');
      const data = await res.json();
      setLibraryComponents(data);
    } catch (e) { console.error(e); }
  };

  const handleInstallAgent = async (agentName: string) => {
    try {
      await fetch('http://localhost:8080/api/agents/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName })
      });
      // Mock validation after a few seconds
      setTimeout(() => setInstalledAgents(prev => ({ ...prev, [agentName]: true })), 3000);
    } catch (e) {
      console.error(e);
    }
  };

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
            // On complete, store current buffer cleanly into history (simulated fetch of new DB state)
            // Note: Since agent generation happens out-of-band via Rust, we patch a simulated result locally to trigger UI updates
            const mockGenerated = html + `<div style="padding:20px; border:1px solid #ccc; background:#fff; margin-top:20px;">[Generated via Prompt] ${prompt}</div>`;
            setHistory(prev => [...prev, html]);
            setFuture([]);
            setHtml(mockGenerated);
            // Sync with backend natively
            fetch('http://localhost:8080/api/mcp/execute', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tool: 'apply_dom_patch', args: { slideId: 'draft', patchData: mockGenerated } })
            });
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2c2b29] group-hover:bg-[#10b981] transition-colors duration-500 shadow-sm" />
            <h1 className="font-semibold tracking-tight text-lg text-[#2c2b29]">Deck AI</h1>
          </div>

          <div className="h-6 w-px bg-[#e8e4d9]" />

          {/* Undo / Redo Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (history.length === 0) return;
                const previous = history[history.length - 1];
                setFuture(prev => [html, ...prev]);
                setHistory(prev => prev.slice(0, -1));
                setHtml(previous);
                fetch('http://localhost:8080/api/mcp/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: 'apply_dom_patch', args: { slideId: 'draft', patchData: previous } }) });
              }}
              disabled={history.length === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-[#e8e4d9] text-[#8b867c] hover:text-[#2c2b29] hover:bg-[#f4f1ea] disabled:opacity-30 transition-all shadow-sm"
              title="Undo"
            >
              <Undo2 size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => {
                if (future.length === 0) return;
                const next = future[0];
                setHistory(prev => [...prev, html]);
                setFuture(prev => prev.slice(1));
                setHtml(next);
                fetch('http://localhost:8080/api/mcp/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: 'apply_dom_patch', args: { slideId: 'draft', patchData: next } }) });
              }}
              disabled={future.length === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-[#e8e4d9] text-[#8b867c] hover:text-[#2c2b29] hover:bg-[#f4f1ea] disabled:opacity-30 transition-all shadow-sm"
              title="Redo"
            >
              <Redo2 size={14} strokeWidth={2.5} />
            </button>
          </div>
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

          <div className="flex items-center gap-2">
            <button onClick={loadLibrary} className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e8e4d9] text-[11px] uppercase tracking-wider font-bold text-[#555] hover:bg-[#e8e4d9] hover:text-[#2c2b29] transition-all duration-300 h-8">
              <Library size={12} strokeWidth={2.5} /> Library
            </button>
            <div className="relative">
              <button
                onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                className="group flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 text-[11px] uppercase tracking-wider font-bold text-[#10b981] hover:bg-[#10b981] hover:text-white transition-all duration-300 h-8"
              >
                <Plug size={12} strokeWidth={2.5} /> Connect
              </button>

              {isAgentMenuOpen && (
                <div className="absolute top-full mt-3 right-0 w-64 bg-white/95 backdrop-blur-xl border border-black/10 shadow-[0_16px_48px_rgba(0,0,0,0.12)] rounded-2xl p-2 z-50 flex flex-col gap-1">
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-[10px] font-bold text-[#8b867c] tracking-widest uppercase">Supported CLI Agents</span>
                  </div>
                  {Object.keys(installedAgents).map(agent => (
                    <button
                      key={agent}
                      onClick={() => !installedAgents[agent] && handleInstallAgent(agent)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${installedAgents[agent] ? 'cursor-default bg-[#10b981]/5 text-[#2c2b29]' : 'hover:bg-[#f4f1ea] text-[#555]'}`}
                    >
                      <span className={`text-[13px] font-medium ${installedAgents[agent] ? 'text-[#10b981]' : ''}`}>{agent}</span>
                      {installedAgents[agent] ? (
                        <div className="flex items-center gap-1.5 text-[#10b981]">
                          <span className="text-[10px] font-bold uppercase tracking-wider">Installed</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-[#a8a49c] uppercase tracking-wider group-hover:text-[#2c2b29]">Install</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-6 w-px bg-[#e8e4d9]" />

          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2c2b29] border border-[#2c2b29] text-[11px] uppercase tracking-wider font-bold text-white hover:bg-black transition-all duration-300 h-8 shadow-sm"
            >
              <Download size={12} strokeWidth={2.5} /> Export <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform duration-300 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportMenuOpen && (
              <div className="absolute top-full mt-3 right-0 w-56 bg-white/95 backdrop-blur-xl border border-black/10 shadow-[0_16px_48px_rgba(0,0,0,0.12)] rounded-2xl p-2 z-50 flex flex-col gap-1">
                <div className="px-3 pt-2 pb-1">
                  <span className="text-[10px] font-bold text-[#8b867c] tracking-widest uppercase">Export Options</span>
                </div>
                <button onClick={() => { handleExport('pdf'); setIsExportMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f4f1ea] transition-all text-left text-[#2c2b29] group">
                  <FileText size={14} className="text-[#10b981]" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold">PDF Document</span>
                    <span className="text-[9px] text-[#8b867c] font-medium font-mono uppercase tracking-widest">High Fidelity</span>
                  </div>
                </button>
                <button onClick={() => { handleExport('pptx'); setIsExportMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f4f1ea] transition-all text-left text-[#2c2b29] group">
                  <Presentation size={14} className="text-[#f59e0b]" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold">PowerPoint (PPTX)</span>
                    <span className="text-[9px] text-[#8b867c] font-medium font-mono uppercase tracking-widest">Editable Nodes</span>
                  </div>
                </button>
                <div className="h-px w-full bg-[#e8e4d9] my-1" />
                <button disabled className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left text-[#a8a49c] opacity-50 cursor-not-allowed">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold">Current Node Only</span>
                    <span className="text-[9px] font-medium font-mono uppercase tracking-widest">Coming Soon</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Component Library Overlay */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-12">
          <div className="bg-[#faf8f5] w-full max-w-5xl h-full max-h-[80vh] rounded-[2rem] shadow-2xl border border-black/10 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#e8e4d9]">
              <div className="flex items-center gap-3">
                <Library className="text-[#10b981]" size={24} strokeWidth={2.5} />
                <h2 className="text-xl font-bold tracking-tight text-[#2c2b29]">Generated Component Library</h2>
              </div>
              <button onClick={() => setIsLibraryOpen(false)} className="w-10 h-10 flex items-center justify-center bg-[#e8e4d9]/50 hover:bg-[#e8e4d9] rounded-full text-[#555] transition-colors">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {libraryComponents.length === 0 ? (
                <div className="col-span-full py-24 flex items-center justify-center text-[#8b867c] font-medium tracking-wide">No UI components have been extracted into SQLite yet.</div>
              ) : (
                libraryComponents.map(comp => (
                  <div key={comp.id} className="bg-white rounded-2xl border border-[#e8e4d9] shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="h-32 bg-[#f4f1ea] border-b border-[#e8e4d9] relative overflow-hidden pointer-events-none flex items-center justify-center p-4">
                      <div className="scale-50 origin-center truncate opacity-70" dangerouslySetInnerHTML={{ __html: comp.htmlPayload.substring(0, 400) }}></div>
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-bold text-[#2c2b29] text-sm mb-1 line-clamp-1">{comp.name}</h3>
                      <p className="text-[10px] text-[#8b867c] font-mono tracking-widest">ID: {comp.id.substring(0, 8)}</p>
                    </div>
                    <div className="p-4 pt-0">
                      <button onClick={() => {
                        setHtml(comp.htmlPayload);
                        setIsLibraryOpen(false);
                        fetch('http://localhost:8080/api/mcp/execute', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: 'apply_dom_patch', args: { slideId: 'draft', patchData: comp.htmlPayload } }) });
                      }} className="w-full py-2 bg-[#f4f1ea] hover:bg-[#10b981] hover:text-white text-[#2c2b29] text-[10px] uppercase tracking-widest font-bold rounded-xl transition-colors duration-300">Mount to Canvas</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🚀 Main Orchestration Stage */}
      <main className="flex-1 relative overflow-hidden flex">

        {/* Left Sidebar: AST Nodes & SSE Real-time Logs */}
        <aside className={`w-[300px] shrink-0 border-r border-[#e8e4d9] bg-[#faf8f5] flex flex-col relative z-20 shadow-[8px_0_32px_rgba(0,0,0,0.02)] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isSidebarOpen ? 'ml-0' : '-ml-[300px]'}`}>

          <div className="p-8 flex-1 flex flex-col gap-8 overflow-y-auto">
            {/* Active Node Targetting & Tool Palette */}
            <div>
              <h2 className="text-[10px] font-bold text-[#8b867c] tracking-[0.2em] uppercase mb-4 flex items-center justify-between">
                Tools
                <span className={`w-1.5 h-1.5 rounded-full ${selectedNode ? 'bg-[#10b981]' : (activeTool !== 'Select' ? 'bg-[#f59e0b]' : 'bg-[#d1d5db]')}`} />
              </h2>

              <div className="flex gap-3 mb-6">
                <button onClick={() => setActiveTool('Select')} className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all ${activeTool === 'Select' ? 'bg-white text-[#10b981] shadow-md border border-[#10b981]/20' : 'bg-transparent text-[#8b867c] hover:bg-white/60 border border-transparent'}`}>
                  <MousePointer2 size={16} strokeWidth={2.5} />
                  <div className="absolute top-full mt-2 bg-black text-white text-[10px] px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl font-bold tracking-widest uppercase">Select Target</div>
                </button>
                <button onClick={() => setActiveTool('Draw')} className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all ${activeTool === 'Draw' ? 'bg-white text-[#f59e0b] shadow-md border border-[#f59e0b]/20' : 'bg-transparent text-[#8b867c] hover:bg-white/60 border border-transparent'}`}>
                  <Pen size={16} strokeWidth={2.5} />
                  <div className="absolute top-full mt-2 bg-black text-white text-[10px] px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl font-bold tracking-widest uppercase">Draw Context</div>
                </button>
                <button onClick={() => setActiveTool('Erase')} className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all ${activeTool === 'Erase' ? 'bg-white text-[#ef4444] shadow-md border border-[#ef4444]/20' : 'bg-transparent text-[#8b867c] hover:bg-white/60 border border-transparent'}`}>
                  <Eraser size={16} strokeWidth={2.5} />
                  <div className="absolute top-full mt-2 bg-black text-white text-[10px] px-2.5 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl font-bold tracking-widest uppercase">Erase Select</div>
                </button>
              </div>

              <div className="flex flex-col gap-3 group relative">
                {selectedNode && (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-[#f4f1ea] text-[#2c2b29] text-[10px] font-mono select-none tracking-wider border border-[#e8e4d9] shadow-sm">&lt;{selectedNode.tag}&gt;</span>
                    </div>
                    <div className="bg-white rounded-xl p-3 max-h-32 overflow-hidden relative shadow-sm border border-[#e8e4d9]">
                      <code className="text-[10px] leading-relaxed font-mono text-[#555] whitespace-pre-wrap break-all">
                        {selectedNode.html.substring(0, 150)}{selectedNode.html.length > 150 ? '...' : ''}
                      </code>
                      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent" />
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <button onClick={handleSteer} disabled={isSteering} className="w-full bg-[#2c2b29] text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-xl hover:bg-black transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2">
                        {isSteering && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                        {isSteering ? "Steering..." : "Isolate & Mutate"}
                      </button>
                      <button onClick={handleSaveComponent} disabled={isSaving} className="w-full border border-[#e8e4d9] text-[#2c2b29] bg-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-xl hover:bg-[#f4f1ea] transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                        {isSaving && <div className="w-3 h-3 border-2 border-[#2c2b29]/20 border-t-[#2c2b29] rounded-full animate-spin" />}
                        {isSaving ? "Saving..." : "Extract Component"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Agent Telemetry / SSE Log Stream (Minimized & Condensed) */}
            <div className="h-40 shrink-0 flex flex-col">
              <h2 className="text-[10px] font-bold text-[#8b867c] tracking-[0.2em] uppercase mb-2 flex items-center justify-between">
                Monitoring
                <div className="relative group cursor-help flex items-center justify-center w-4 h-4">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                  <div className="absolute top-1/2 -translate-y-1/2 right-6 bg-[#2c2b29] text-white text-[10px] px-2.5 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    SSE Stream Active
                  </div>
                </div>
              </h2>
              <div className="flex-1 bg-transparent border-t border-[#e8e4d9]/50 pt-2 overflow-y-auto font-mono text-[9px] text-[#8b867c] leading-tight scroll-smooth px-1">
                {agentLogs.length === 0 ? (
                  <p className="text-[#a8a49c]/50 italic">No activity logs...</p>
                ) : (
                  agentLogs.map((log, i) => (
                    <div key={i} className={`mb-1 truncate ${log.includes('[System]') ? 'text-amber-600 font-semibold' : log.includes('Error') || log.includes('Warning') ? 'text-red-500' : 'text-[#8b867c]'}`}>
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

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-4 left-4 z-40 p-2 bg-white/50 hover:bg-white backdrop-blur border border-[#e8e4d9] rounded-xl text-[#8b867c] hover:text-[#2c2b29] shadow-sm transition-all"
            title="Toggle Sidebar"
          >
            {isSidebarOpen ? <PanelLeftClose size={18} strokeWidth={2.5} /> : <PanelLeftOpen size={18} strokeWidth={2.5} />}
          </button>

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
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-80px)] px-0 z-50">
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
