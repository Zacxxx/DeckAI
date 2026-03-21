import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Minimize2, Play, Pause, RotateCcw, Download, Share2 } from 'lucide-react';

interface CanvasPreviewProps {
  title?: string;
  subtitle?: string;
  data?: any;
  className?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

export default function CanvasPreview({ 
  title = "Strategic Market Alignment", 
  subtitle = "Q4 2026 Executive Summary",
  className = "",
  aspectRatio = '16:9'
}: CanvasPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      id: '01',
      title: title,
      subtitle: subtitle,
      stats: [
        { label: 'Growth Vector', value: '+24.8%' },
        { label: 'Market Cap', value: '$4.2B' }
      ],
      chartData: [60, 85, 45, 95]
    },
    {
      id: '02',
      title: "Operational Efficiency",
      subtitle: "Resource Optimization Strategy",
      stats: [
        { label: 'Efficiency Gain', value: '+18.2%' },
        { label: 'OpEx Reduction', value: '-12.5%' }
      ],
      chartData: [40, 55, 75, 65]
    },
    {
      id: '03',
      title: "Strategic Roadmap",
      subtitle: "FY2027 Expansion Targets",
      stats: [
        { label: 'New Markets', value: '12' },
        { label: 'R&D Velocity', value: 'High' }
      ],
      chartData: [30, 90, 50, 80]
    }
  ];

  const currentSlide = slides[currentPage];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Auto-advance page if playing
            setCurrentPage((p) => (p + 1) % slides.length);
            return 0;
          }
          return prev + 0.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPage((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPage((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const ratioClass = aspectRatio === '16:9' ? 'aspect-video' : aspectRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-square';

  return (
    <div 
      ref={containerRef}
      className={`relative group rounded-[32px] overflow-hidden bg-ink shadow-2xl transition-all duration-700 ${ratioClass} ${className} ${isFullscreen ? 'rounded-none w-full h-full' : ''}`}
    >
      {/* Background Grid / Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10" />
      </div>

      {/* Slide Content */}
      <div className="relative h-full w-full p-12 flex flex-col justify-between select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-bg/10 border border-bg/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-sm bg-bg" />
                  </div>
                  <span className="text-[10px] font-bold text-bg/40 uppercase tracking-[0.4em]">Proprietary & Confidential</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-serif italic text-bg leading-tight mb-2">
                  {currentSlide.title}
                </h2>
                <p className="text-sm text-bg/60 font-light tracking-widest uppercase">
                  {currentSlide.subtitle}
                </p>
              </div>

              <div className="text-right">
                <span className="text-6xl font-bold text-bg/10 tabular-nums">{currentSlide.id}</span>
              </div>
            </div>

            {/* Visual Data Representation (Mock) */}
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="w-full max-w-2xl grid grid-cols-4 gap-4 items-end h-48">
                {currentSlide.chartData.map((height, i) => (
                  <motion.div
                    key={`${currentPage}-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${height}%`, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "circOut" }}
                    className="relative group/bar"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/20 to-bg/5 rounded-t-xl border-x border-t border-bg/10 group-hover/bar:from-bg/30 transition-all duration-500" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-bg/40 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      {height}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-4">
                <div className="flex gap-12">
                  {currentSlide.stats.map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-bg/30 uppercase tracking-widest">{stat.label}</span>
                      <span className="text-xl font-bold text-bg">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <div className="w-64 h-px bg-bg/10 relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-bg/40"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-8 text-[10px] font-bold text-bg/40 uppercase tracking-[0.2em]">
                <span>System Status: Optimal</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-bg/10 text-bg border border-bg/20 flex items-center justify-center hover:bg-bg/20 transition-all backdrop-blur-md"
        >
          <RotateCcw className="w-5 h-5 -scale-x-100" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-bg/10 text-bg border border-bg/20 flex items-center justify-center hover:bg-bg/20 transition-all backdrop-blur-md"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6 backdrop-blur-sm">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-14 h-14 rounded-full bg-bg text-ink flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button 
          onClick={() => setProgress(0)}
          className="w-12 h-12 rounded-full bg-bg/10 text-bg border border-bg/20 flex items-center justify-center hover:bg-bg/20 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Bar Controls */}
      <div className="absolute bottom-0 inset-x-0 p-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0 transition-transform">
        <div className="flex items-center gap-4">
          <button className="p-2 text-bg/60 hover:text-bg transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-bg/60 hover:text-bg transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        
        <button 
          onClick={toggleFullscreen}
          className="p-2 text-bg/60 hover:text-bg transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Ambient Glow */}
      <div className="absolute -inset-24 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}
