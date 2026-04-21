import React, { useRef, useState, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useSound } from '../hooks/useSound';
import { useHighlights } from '../hooks/useHighlights';
import { Share2, Highlighter, Eraser, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { CoverPage } from './CoverPage';

const SLIDES = [
  ...Array.from({ length: 10 }, (_, i) => `/slides/slide_${String(i + 1).padStart(2, '0')}.png`)
];

export const Flipbook = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const { playFlipSound } = useSound();
  const { isHighlighting, toggleHighlighting } = useHighlights();
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
    playFlipSound();
  }, [playFlipSound]);

  const toggleZoom = () => {
    setZoom(prev => (prev === 1 ? 1.5 : 1));
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 1), 2));
  };

  const drawHighlight = (e: React.MouseEvent<HTMLCanvasElement>, index: number) => {
    if (!isHighlighting) return;
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    ctx.fillStyle = 'rgba(201, 168, 76, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearHighlights = () => {
    canvasRefs.current.forEach(canvas => {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'BAS SIGNAL: FORBES AI 50',
      text: 'Insights from Bhramaastra Advisory Services',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const bookWidth = window.innerWidth > 1024 ? 700 : 450;
  const bookHeight = bookWidth * 1.414;

  return (
    <div className="app-container">
      <div className="page-indicator">
        {currentPage === 0 ? 'BAS SIGNAL' : `PAGE ${currentPage} / ${SLIDES.length}`}
      </div>

      <div 
        className="flipbook-wrapper" 
        style={{ transform: `scale(${zoom})` }}
      >
        <HTMLFlipBook
          width={bookWidth}
          height={bookHeight}
          size="stretch"
          minWidth={315}
          maxWidth={1400}
          minHeight={444}
          maxHeight={2000}
          maxShadowOpacity={0.4}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="flipbook-canvas"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
          ref={bookRef}
        >
          {/* Hybrid Cover Page */}
          <CoverPage />

          {/* Regular Slide Pages */}
          {SLIDES.map((src, index) => (
            <div key={index + 1} className="page" data-density="hard">
              <img src={src} alt={`Slide ${index + 1}`} />
              <canvas
                ref={el => { canvasRefs.current[index + 1] = el; }}
                className="canvas-overlay"
                width={bookWidth}
                height={bookHeight}
                onMouseMove={(e) => drawHighlight(e, index + 1)}
                onMouseDown={(e) => drawHighlight(e, index + 1)}
                style={{ pointerEvents: isHighlighting ? 'auto' : 'none' }}
              />
            </div>
          ))}
        </HTMLFlipBook>
      </div>

      <div className="controls-bar">
        <button className="btn" onClick={() => bookRef.current.pageFlip().flipPrev()}>
          <ChevronLeft size={24} />
        </button>
        
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />

        <div className="zoom-controls">
          <button className="btn" onClick={() => handleZoom(-0.1)} title="Zoom Out">
            <ZoomOut size={20} />
          </button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button className="btn" onClick={() => handleZoom(0.1)} title="Zoom In">
            <ZoomIn size={20} />
          </button>
          <button 
            className={`btn ${zoom > 1 ? 'active' : ''}`} 
            onClick={toggleZoom} 
            title="Toggle Immersive"
          >
            <Maximize2 size={20} />
          </button>
        </div>

        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />

        <button 
          className={`btn ${isHighlighting ? 'active' : ''}`} 
          onClick={toggleHighlighting}
          title="Highlight Tool"
        >
          <Highlighter size={24} />
        </button>

        <button className="btn" onClick={clearHighlights} title="Clear Highlights">
          <Eraser size={24} />
        </button>

        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />

        <button className="btn" onClick={handleShare} title="Share">
          <Share2 size={24} />
        </button>

        <button className="btn" onClick={() => window.print()} title="Download/Print">
          <Download size={24} />
        </button>

        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />

        <button className="btn" onClick={() => bookRef.current.pageFlip().flipNext()}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
