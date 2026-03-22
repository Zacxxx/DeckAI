import React, { useRef, useEffect, useState } from 'react';

interface CanvasProps {
    format: '16:9' | 'A4';
    htmlContent: string;
    onNodeSelect?: (payload: { html: string, tag: string }) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ format, htmlContent, onNodeSelect }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // 16:9 = 1920x1080, A4 = 794x1123 (at 96 DPI approximations)
    const dimensions = format === '16:9'
        ? { width: 1920, height: 1080 }
        : { width: 794, height: 1123 };

    useEffect(() => {
        const calculateScale = () => {
            if (!containerRef.current) return;
            const container = containerRef.current.getBoundingClientRect();
            // Leave a luxurious 128px bounding padding
            const scaleX = (container.width - 128) / dimensions.width;
            const scaleY = (container.height - 128) / dimensions.height;
            // Native scaling avoids any CSS layout breakage natively triggered by zoom
            setScale(Math.min(scaleX, scaleY, 1));
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);

        // Steering Protocol Listener
        const handleMessage = (e: MessageEvent) => {
            if (e.data?.type === 'USER_NODE_SELECT' && onNodeSelect) {
                onNodeSelect({ html: e.data.htmlPayload, tag: e.data.tagName });
            }
        };
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('resize', calculateScale);
            window.removeEventListener('message', handleMessage);
        };
    }, [dimensions.width, dimensions.height, onNodeSelect]);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-[#f4f1ea] overflow-hidden relative">
            <div
                className="bg-white shadow-2xl transition-transform duration-300 ease-out origin-center"
                style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    transform: `scale(${scale})`,
                }}
            >
                {/* 
                    Steering interactions will eventually hook into this iframe natively.
                    For now, it guarantees perfectly isolated mathematical bounds.
                */}
                <iframe
                    title="DeckAI Validation Bounds"
                    className="w-full h-full border-none pointer-events-none"
                    srcDoc={`
                        <!DOCTYPE html>
                        <html>
                            <head>
                                <style>
                                    body { margin: 0; overflow: hidden; font-family: 'Inter', sans-serif; background: transparent; }
                                    ::-webkit-scrollbar { display: none; }
                                </style>
                                <script>
                                    // 10x Steering Protocol Native Interceptors
                                    document.addEventListener('mouseover', (e) => {
                                        if(e.target === document.body || e.target === document.documentElement) return;
                                        e.target.style.outline = '2px solid #06b6d4';
                                        e.target.style.outlineOffset = '-2px';
                                        e.target.style.cursor = 'crosshair';
                                        e.target.style.transition = 'outline 0.1s ease';
                                    });
                                    document.addEventListener('mouseout', (e) => {
                                        e.target.style.outline = '';
                                    });
                                    document.addEventListener('click', (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.parent.postMessage({ 
                                            type: 'USER_NODE_SELECT', 
                                            htmlPayload: e.target.outerHTML,
                                            tagName: e.target.tagName.toLowerCase() 
                                        }, '*');
                                        
                                        // Active feedback
                                        e.target.style.outline = '3px solid #10b981';
                                        setTimeout(() => e.target.style.outline = '', 300);
                                    });
                                </script>
                            </head>
                            <body>${htmlContent}</body>
                        </html>
                    `}
                />
            </div>

            {/* Resolution Meta Overlay */}
            <div className="absolute bottom-4 left-4 text-[#8b867c] text-xs font-mono select-none tracking-widest uppercase">
                [Viewport: {format}] :: {dimensions.width}x{dimensions.height}px @ Scale {(scale * 100).toFixed(1)}%
            </div>
        </div>
    );
};
