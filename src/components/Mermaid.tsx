'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#ffffff',
    primaryTextColor: '#fff',
    primaryBorderColor: '#ffffff',
    lineColor: '#ffffff',
    secondaryColor: '#050505',
    tertiaryColor: '#101010',
    fontSize: '14px',
  },
});

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="mermaid bg-foreground/5 p-6 rounded-2xl overflow-auto flex justify-center" ref={ref}>
      {chart}
    </div>
  );
}
