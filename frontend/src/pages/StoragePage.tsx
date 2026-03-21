import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  ExternalLink, 
  Trash2, 
  Clock,
  FileText,
  Layout as LayoutIcon,
  PlusCircle,
  ShieldCheck,
  FileDown,
  Database,
  Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Deck {
  id: string;
  title: string;
  created_at: string;
  slides_count: number;
  style: string;
  status: string;
}

export default function StoragePage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const { data, error } = await supabase
          .from('decks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDecks(data || []);
      } catch (err) {
        console.error('Error fetching decks:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDecks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('decks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDecks(decks.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting deck:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
                <Database className="w-5 h-5 text-muted" />
             </div>
             <h1 className="text-5xl font-serif italic text-ink">Archive</h1>
          </div>
          <p className="text-muted font-light tracking-wide max-w-md">
            Secure repository for high-fidelity corporate narratives and strategic documentation.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted group-focus-within:text-ink transition-colors" />
            <input
              type="text"
              placeholder="Search Archive..."
              className="pl-12 pr-6 py-4 bg-glass-bg border border-glass-border rounded-full text-[10px] font-bold uppercase tracking-widest text-ink focus:outline-none focus:ring-1 focus:ring-ink/10 w-80 transition-all"
            />
          </div>
          <button className="p-4 bg-glass-bg border border-glass-border rounded-full text-muted hover:text-ink transition-all duration-500">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-muted" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
          {decks.map((deck, i) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-glass-bg border border-glass-border hover:bg-ink/5 transition-all duration-700 relative overflow-hidden"
            >
              {/* Preview Thumbnail */}
              <div className="aspect-video bg-bg/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <LayoutIcon className="w-12 h-12 text-ink/10 group-hover:text-ink/20 transition-colors duration-700" />
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-bg/60 backdrop-blur-md border border-glass-border">
                   <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
                   <span className="text-[9px] font-bold text-muted uppercase tracking-[0.1em]">{deck.status}</span>
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button className="p-2.5 bg-bg/60 backdrop-blur-md rounded-full text-muted hover:text-ink transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-10">
                <h3 className="text-sm font-bold text-ink uppercase tracking-widest mb-3 truncate group-hover:text-elegant transition-colors">{deck.title}</h3>
                <div className="flex items-center gap-4 text-[9px] font-bold text-muted uppercase tracking-[0.2em] mb-10">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {new Date(deck.created_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{deck.slides_count} Slides</span>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-glass-border">
                  <div className="px-4 py-1.5 rounded-full bg-glass-bg text-[9px] font-bold text-muted uppercase tracking-widest border border-glass-border">
                    {deck.style}
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-muted hover:text-ink transition-colors duration-500" title="Download PDF">
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted hover:text-ink transition-colors duration-500" title="Open Preview">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(deck.id)}
                      className="p-2 text-muted hover:text-red-900 transition-colors duration-500" title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Empty State / Add New */}
          <button className="aspect-[4/5] bg-glass-bg border border-glass-border border-dashed hover:bg-ink/5 hover:border-ink/10 transition-all duration-700 flex flex-col items-center justify-center gap-8 group">
            <div className="w-16 h-16 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <PlusCircle className="w-6 h-6 text-muted group-hover:text-ink" />
            </div>
            <span className="text-[11px] font-bold text-muted uppercase tracking-[0.3em] group-hover:text-ink transition-colors">Initialize New Narrative</span>
          </button>
        </div>
      )}
    </div>
  );
}
