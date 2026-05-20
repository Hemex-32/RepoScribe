'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#e2e8f0',
    primaryTextColor: '#fff',
    primaryBorderColor: '#e2e8f0',
    lineColor: '#e2e8f0',
    secondaryColor: '#020203',
    tertiaryColor: '#0f172a',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
});

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Sanitize the chart string to remove potential markdown wrapping
  const cleanChart = chart
    .replace(/^```mermaid\n?/, '')
    .replace(/\n?```$/, '')
    .trim();

  useEffect(() => {
    if (ref.current && cleanChart) {
      try {
        ref.current.removeAttribute('data-processed');
        mermaid.contentLoaded();
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    }
  }, [cleanChart]);

  return (
    <div 
      key={cleanChart}
      className="mermaid bg-white/[0.01] p-10 rounded-[2rem] border border-white/5 overflow-auto flex justify-center backdrop-blur-sm" 
      ref={ref}
    >
      {cleanChart}
    </div>
  );
}
