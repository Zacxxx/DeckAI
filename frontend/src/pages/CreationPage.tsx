import React, { useState } from 'react';
import { 
  PlusCircle, 
  MessageSquare, 
  Palette, 
  Layers, 
  Target, 
  Sparkles, 
  Link as LinkIcon, 
  FileText, 
  Upload, 
  ChevronRight, 
  Loader2,
  Cpu,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import CanvasPreview from '../components/CanvasPreview';

export default function CreationPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLang, setSelectedLang] = useState('executive');

  const designLanguages = [
    { id: 'executive', name: 'Executive' },
    { id: 'structural', name: 'Structural' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'avant-garde', name: 'Avant-Garde' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // 1. Call the backend API (which will eventually use Rust logic)
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: selectedLang }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // 2. Save the metadata to Supabase
        const { error } = await supabase
          .from('decks')
          .insert([
            { 
              title: result.data.title, 
              style: selectedLang,
              slides_count: Math.floor(Math.random() * 10) + 5, // Placeholder
              status: 'Verified'
            }
          ]);

        if (error) throw error;
        
        alert('Narrative synthesized and archived successfully.');
        setPrompt('');
      }
    } catch (error) {
      console.error('Synthesis failed:', error);
      alert('Synthesis engine encountered an error. Please check console.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
      <header className="mb-20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 glass rounded-full flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-ink" />
          </div>
          <h1 className="text-5xl font-serif italic text-ink">Initialize Narrative</h1>
        </div>
        <p className="text-muted font-light tracking-wide max-w-xl leading-relaxed">
          Configure the AI synthesis engine to generate high-fidelity corporate presentations tailored to your specific strategic objectives.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Configuration Panel */}
        <div className="lg:col-span-7 space-y-16">
          {/* Prompt Section */}
          <section className="glass p-10 rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity duration-1000">
              <Cpu className="w-12 h-12 text-muted" />
            </div>
            <label className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-8">
              <MessageSquare className="w-3.5 h-3.5" />
              Strategic Intent
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the core narrative, key data points, and desired outcomes..."
              className="w-full h-64 bg-transparent border-none text-ink placeholder:text-muted/30 focus:outline-none transition-all resize-none font-light leading-relaxed text-xl"
            />
          </section>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Design Language */}
            <div className="glass p-10 rounded-[40px]">
              <label className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-10">
                <Palette className="w-3.5 h-3.5" />
                Visual Identity
              </label>
              <div className="grid grid-cols-2 gap-4">
                {designLanguages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`px-4 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-700 ${
                      selectedLang === lang.id
                        ? 'bg-ink text-bg border-ink shadow-xl shadow-ink/10'
                        : 'bg-glass-bg border-glass-border text-muted hover:text-ink hover:border-ink/20'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div className="glass p-10 rounded-[40px]">
              <label className="flex items-center gap-3 text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-10">
                <Layers className="w-3.5 h-3.5" />
                Structural Depth
              </label>
              <div className="space-y-8">
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="1" 
                  className="w-full accent-ink h-1.5 bg-glass-bg rounded-full appearance-none cursor-pointer" 
                />
                <div className="flex justify-between text-[10px] font-bold text-muted uppercase tracking-widest">
                  <span>Concise</span>
                  <span>Balanced</span>
                  <span>Exhaustive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Synthesis Preview & Actions */}
        <div className="lg:col-span-5 space-y-10">
          <div className="glass p-10 rounded-[40px] sticky top-32">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-[10px] font-bold text-ink uppercase tracking-[0.3em] flex items-center gap-3">
                <Eye className="w-3.5 h-3.5 text-muted" />
                Live Synthesis Preview
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-bold text-muted uppercase tracking-widest">Engine Active</span>
              </div>
            </div>

            <div className="mb-10">
              <CanvasPreview 
                title={prompt || "Narrative Title"}
                subtitle={`${selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1)} Design Language`}
                className="shadow-inner"
              />
            </div>
            
            <div className="space-y-4 mb-10">
              <div className="p-5 rounded-3xl bg-glass-bg border border-glass-border flex items-center gap-5 group cursor-pointer hover:bg-ink/5 transition-all duration-500">
                <div className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-ink/80 font-medium">Strategic_Context.pdf</span>
                  <span className="text-[10px] text-muted uppercase tracking-widest">2.4 MB</span>
                </div>
              </div>
              
              <button className="w-full py-5 rounded-3xl border border-dashed border-glass-border text-muted hover:text-ink hover:border-ink/20 transition-all duration-700 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                <Upload className="w-3.5 h-3.5" />
                Append Knowledge Base
              </button>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className={`w-full py-6 rounded-full font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-1000 ${
                isGenerating || !prompt
                  ? 'bg-ink/5 text-muted border border-glass-border cursor-not-allowed'
                  : 'bg-ink text-bg hover:bg-ink/90 shadow-2xl shadow-ink/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  Generate Narrative
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="mt-10 pt-10 border-t border-glass-border space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Security Protocol</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500/30" />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Processing Node</span>
                  <span className="text-[10px] text-muted font-mono">RUST_V3_CORE</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
