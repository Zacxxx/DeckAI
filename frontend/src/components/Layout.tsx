import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Database, PlusCircle, LogOut, Menu, X, Sparkles, ShieldCheck, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const navItems = [
    { id: 'user-area', label: 'Create Deck', icon: PlusCircle },
    { id: 'storage', label: 'My Decks', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-[#020203] text-slate-200 font-sans selection:bg-slate-500/30">
      {/* Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 px-6 lg:px-12 pointer-events-none">
        <nav className="max-w-7xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onPageChange('landing')}>
            <div className="w-8 h-8 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center justify-center group-hover:bg-white/[0.08] transition-all duration-500">
              <ShieldCheck className="w-4 h-4 text-slate-100" />
            </div>
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-slate-100">DeckAI</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 mr-2 text-muted hover:text-ink transition-colors duration-500 rounded-full hover:bg-glass-bg"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-500 ${
                  currentPage === item.id
                    ? 'bg-ink text-bg'
                    : 'text-muted hover:text-ink hover:bg-glass-bg'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="w-px h-4 bg-glass-border mx-4" />
            <button className="p-2 text-muted hover:text-ink transition-colors duration-500">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-[#050505] border-l border-white/[0.05] p-12 flex flex-col gap-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-xs font-bold tracking-[0.2em] uppercase transition-all ${
                      currentPage === item.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-auto">
                <button className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 hover:text-red-500 transition-all flex items-center gap-3">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-20 bg-[#020203]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-slate-100" />
                </div>
                <span className="text-base font-medium tracking-widest uppercase text-slate-100">DeckAI</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                The definitive platform for high-fidelity corporate presentations, powered by advanced AI and high-performance Rust rendering.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Platform</h4>
                <div className="flex flex-col gap-2 text-sm text-slate-500">
                  <a href="#" className="hover:text-slate-100 transition-colors">Features</a>
                  <a href="#" className="hover:text-slate-100 transition-colors">Security</a>
                  <a href="#" className="hover:text-slate-100 transition-colors">Enterprise</a>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Company</h4>
                <div className="flex flex-col gap-2 text-sm text-slate-500">
                  <a href="#" className="hover:text-slate-100 transition-colors">About</a>
                  <a href="#" className="hover:text-slate-100 transition-colors">Contact</a>
                  <a href="#" className="hover:text-slate-100 transition-colors">Terms</a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/[0.03] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">
              &copy; 2026 DeckAI Systems. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
                System Status: Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
