'use client';

import { useState } from 'react';
import { Github, FileText, Layout, Send, Loader2 } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    setStatus('Fetching repository contents...');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to generate');

      setResult(data);
      setStatus('Codebase analyzed! (Ready for Phase 3)');
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-3xl w-100 space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-accent/10 rounded-2xl">
              <FileText className="w-12 h-12 text-accent" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">
            Docu<span className="text-accent">Gen</span>
          </h1>
          <p className="text-xl text-foreground/60 max-w-lg mx-auto">
            Transform your GitHub repository into professional documentation and architecture diagrams in seconds.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Github className="h-5 w-5 text-foreground/40 group-focus-within:text-accent transition-colors" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            className="block w-full pl-12 pr-32 py-4 bg-foreground/5 border border-border rounded-2xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all text-lg"
          />
          <button
            type="submit"
            disabled={isLoading || !url}
            className="absolute inset-y-2 right-2 px-6 bg-accent text-background font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Generate</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Status & Results */}
        {(status || result) && (
          <div className="space-y-4 animate-in">
            {status && (
              <p className={`text-sm ${status.startsWith('Error') ? 'text-red-400' : 'text-accent'}`}>
                {status}
              </p>
            )}
            {result && (
              <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl text-left">
                <p className="font-bold text-accent">Success!</p>
                <p className="text-sm text-foreground/70">
                  Fetched <span className="text-foreground font-mono">{result.fileCount}</span> files from <span className="text-foreground font-mono">{result.owner}/{result.repo}</span>.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
          <div className="p-6 bg-foreground/5 border border-border rounded-2xl text-left space-y-3">
            <FileText className="w-6 h-6 text-accent" />
            <h3 className="font-bold text-lg">Perfect READMEs</h3>
            <p className="text-sm text-foreground/60">Comprehensive project overviews, installation guides, and usage examples generated from your source code.</p>
          </div>
          <div className="p-6 bg-foreground/5 border border-border rounded-2xl text-left space-y-3">
            <Layout className="w-6 h-6 text-accent" />
            <h3 className="font-bold text-lg">Architecture Diagrams</h3>
            <p className="text-sm text-foreground/60">Visual Mermaid.js diagrams that map out your system components and their relationships automatically.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-foreground/40 text-sm">
        Built for developers who value their time.
      </footer>
    </main>
  );
}
