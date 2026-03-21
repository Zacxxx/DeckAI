import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Zap, Shield, Layout as LayoutIcon, FileText, Globe, BarChart3, Fingerprint } from 'lucide-react';
import CanvasPreview from '../components/CanvasPreview';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-48 pb-48 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-glass-bg border border-glass-border text-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-12"
          >
            <Fingerprint className="w-3 h-3 text-muted" />
            <span>Enterprise Grade Intelligence</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-9xl font-serif italic text-ink mb-8 leading-[0.9]"
          >
            The future of <br />
            <span className="text-elegant not-italic font-sans font-bold tracking-tighter">
              Corporate Narrative.
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-muted max-w-2xl mb-16 leading-relaxed font-light tracking-wide"
          >
            High-fidelity slide decks engineered for the modern executive. 
            Leverage advanced AI to transform complex data into compelling visual stories.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-ink text-bg font-bold text-xs uppercase tracking-widest rounded-full hover:bg-ink/90 transition-all duration-500 flex items-center justify-center gap-3 group"
            >
              Initialize Engine
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-glass-bg hover:bg-glass-bg/2 text-ink font-bold text-xs uppercase tracking-widest rounded-full border border-glass-border transition-all duration-500">
              Request Demo
            </button>
          </motion.div>
        </div>

        {/* Floating Stats / Interactive Elements */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden xl:block w-96 space-y-6">
          {[
            { label: "Rendering Speed", value: "0.4s", sub: "Rust Engine" },
            { label: "AI Precision", value: "99.2%", sub: "Enterprise Model" },
            { label: "Global Reach", value: "140+", sub: "Languages Supported" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 + (i * 0.2) }}
              className="glass p-8 rounded-3xl flex flex-col gap-1 hover:bg-glass-bg/2 transition-colors cursor-default group"
            >
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest group-hover:text-ink transition-colors">{stat.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-ink">{stat.value}</span>
                <span className="text-[10px] text-muted italic font-serif">{stat.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Marquee Section */}
      <div className="relative border-y border-glass-border bg-glass-bg/50 py-8 overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-24 whitespace-nowrap items-center"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-24">
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">Strategic Alignment</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">Data Synthesis</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">Global Compliance</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">Rust Rendering</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Features Section - Grid Layout */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto border-t border-glass-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {[
            {
              icon: Globe,
              title: "Global Compliance",
              description: "Automatic formatting for international standards and regulatory requirements."
            },
            {
              icon: BarChart3,
              title: "Data Synthesis",
              description: "Seamlessly integrate live financial data and complex analytics into your narrative."
            },
            {
              icon: Shield,
              title: "Secure Infrastructure",
              description: "End-to-end encryption and private cloud options for sensitive corporate data."
            },
            {
              icon: Zap,
              title: "Rust Core",
              description: "Unparalleled performance with our proprietary HTML-to-PDF rendering engine."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-glass-bg/50 border border-glass-border hover:bg-glass-bg transition-all duration-700 group"
            >
              <div className="w-12 h-12 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <feature.icon className="w-5 h-5 text-muted group-hover:text-ink transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-widest mb-4">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed font-light">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Preview Section */}
      <section className="py-32 bg-glass-bg/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif italic text-ink mb-6">Experience the Precision.</h2>
            <p className="text-muted font-light tracking-wide max-w-2xl mx-auto">
              Our 16:9 rendering engine ensures every pixel is calculated for maximum impact, 
              providing a high-fidelity preview of your strategic narrative.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <CanvasPreview 
              title="Strategic Market Alignment"
              subtitle="Q4 2026 Executive Summary"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
