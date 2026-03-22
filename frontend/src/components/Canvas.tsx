import React, { useRef, useEffect, useState } from 'react';

interface CanvasProps {
    format: '16:9' | 'A4';
    htmlContent: string;
}

export const Canvas: React.FC<CanvasProps> = ({ format, htmlContent }) => {
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
        return () => window.removeEventListener('resize', calculateScale);
    }, [dimensions.width, dimensions.height]);

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
