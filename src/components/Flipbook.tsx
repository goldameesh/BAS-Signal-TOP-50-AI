import React, { useRef, useState, useCallback, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useSound } from '../hooks/useSound';
import { useHighlights } from '../hooks/useHighlights';
import { Share2, Highlighter, Eraser, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Volume2, VolumeX } from 'lucide-react';
import { CoverPage } from './CoverPage';

const SLIDES = [
  ...Array.from({ length: 10 }, (_, i) => `/slides/slide_${String(i + 1).padStart(2, '0')}.png`)
];

export const Flipbook = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const { playFlipSound, initAudio } = useSound();
  const { isHighlighting, toggleHighlighting } = useHighlights();
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
    if (!isMuted) playFlipSound();
  }, [playFlipSound, isMuted]);

  const handleInteraction = () => {
    initAudio();
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 1), 2.5));
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

  const isMobile = windowSize.width < 768;
  const bookWidth = isMobile ? windowSize.width * 0.9 : 700;
  const bookHeight = bookWidth * 1.414;

  return (
    <div className="app-container" onClick={handleInteraction} onTouchStart={handleInteraction}>
      <div className="page-indicator" style={{ position: isMobile ? 'fixed' : 'absolute' }}>
        {currentPage === 0 ? 'BAS SIGNAL' : `PAGE ${currentPage} / ${SLIDES.length}`}
      </div>

      <div 
        className="flipbook-wrapper" 
        style={{ 
          transform: `scale(${zoom})`,
          marginTop: isMobile ? '5rem' : '0'
        }}
      >
        <HTMLFlipBook
          width={bookWidth}
          height={bookHeight}
          size="stretch"
          minWidth={280}
          maxWidth={1400}
          minHeight={400}
          maxHeight={2000}
          maxShadowOpacity={0.4}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="flipbook-canvas"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={800}
          usePortrait={isMobile}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={false}
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

      <div className="controls-bar" style={{ position: 'fixed' }}>
        <button className="btn" onClick={() => bookRef.current.pageFlip().flipPrev()}>
          <ChevronLeft size={isMobile ? 20 : 24} />
        </button>
        
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />

        <div className="zoom-controls">
          <button className="btn" onClick={() => handleZoom(-0.1)} title="Zoom Out">
            <ZoomOut size={isMobile ? 18 : 20} />
          </button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button className="btn" onClick={() => handleZoom(0.1)} title="Zoom In">
            <ZoomIn size={isMobile ? 18 : 20} />
          </button>
          <button 
            className={`btn ${zoom > 1 ? 'active' : ''}`} 
            onClick={() => setZoom(prev => (prev === 1 ? 1.8 : 1))} 
            title="Toggle Immersive"
          >
            <Maximize size={isMobile ? 18 : 20} />
          </button>
        </div>

        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />

        <button 
          className="btn" 
          onClick={() => { initAudio(); setIsMuted(!isMuted); }} 
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX size={isMobile ? 20 : 24} /> : <Volume2 size={isMobile ? 20 : 24} />}
        </button>

        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />

        <button 
          className={`btn ${isHighlighting ? 'active' : ''}`} 
          onClick={toggleHighlighting}
          title="Highlight Tool"
        >
          <Highlighter size={isMobile ? 20 : 24} />
        </button>

        <div className="desktop-only" style={{ display: isMobile ? 'none' : 'contents' }}>
          <button className="btn" onClick={clearHighlights} title="Clear Highlights">
            <Eraser size={24} />
          </button>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />
          <button className="btn" onClick={() => window.print()} title="Download/Print">
            <Download size={24} />
          </button>
        </div>

        <button className="btn" onClick={handleShare} title="Share">
          <Share2 size={isMobile ? 20 : 24} />
        </button>

        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />

        <button className="btn" onClick={() => bookRef.current.pageFlip().flipNext()}>
          <ChevronRight size={isMobile ? 20 : 24} />
        </button>
      </div>
    </div>
  );
};
