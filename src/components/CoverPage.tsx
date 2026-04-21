import React from 'react';

export const CoverPage = React.forwardRef<HTMLDivElement>((props: any, ref) => {
  return (
    <div className="page" ref={ref} style={props.style} data-density="hard">
      <div className="hybrid-cover">
        {/* The Beautiful AI-Generated Artwork as Background */}
        <img 
          src="/master-cover.png" 
          alt="" 
          className="hybrid-bg"
        />

        {/* Sharp CSS-Only Text Overlays to Avoid AI "Clumsy" Rendering and Cropping */}
        <div className="hybrid-overlay">
          <div className="cover-accent-line" style={{ marginTop: '1rem' }} />
          
          <img src="/bas-logo.png" alt="BAS" className="hybrid-logo" />

          <div className="hybrid-title-box">
            <h1 className="hybrid-title">BAS SIGNAL</h1>
            <p className="hybrid-subtitle">FORBES AI 50 - VOL 1</p>
          </div>

          <div className="hybrid-summary-box">
            <p className="hybrid-summary">
              Decoding the 2026 AI Economy through a 5-layer framework. 
              Mapping category concentration and capital distribution to 
              define the new era of innovation and strategic moats.
            </p>
          </div>

          <div className="hybrid-footer">
            www.bhramaastra.com
          </div>
          
          <div className="cover-accent-line" style={{ marginBottom: '1rem' }} />
        </div>
      </div>
    </div>
  );
});

CoverPage.displayName = 'CoverPage';
