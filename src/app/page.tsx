'use client';

import { useState } from 'react';
import { Github, FileText, Layout, Send, Loader2, Copy, Download, Check, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Mermaid from '@/components/Mermaid';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'readme' | 'architecture'>('readme');
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    setStatus('Fetching codebase and generating documentation with AI...');
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
      setStatus('Documentation generated successfully!');
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.readme);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen p-6 bg-background text-foreground flex flex-col items-center">
      <div className={`w-full max-w-5xl space-y-8 transition-all duration-1000 ${result ? 'mt-8' : 'mt-20 flex flex-col items-center text-center'}`}>
        {/* Header */}
        <div className={`space-y-4 ${result ? 'text-left' : 'text-center'}`}>
          <div className={`flex ${result ? 'justify-start' : 'justify-center'}`}>
            <div className="p-3 bg-accent/10 rounded-2xl">
              <FileText className="w-10 h-10 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Docu<span className="text-accent">Gen</span>
          </h1>
          {!result && (
            <p className="text-lg text-foreground/60 max-w-lg mx-auto">
              Transform your GitHub repository into professional documentation and architecture diagrams in seconds.
            </p>
          )}
        </div>

        {/* Input Form */}
        <div className={`w-full ${result ? 'max-w-xl' : 'max-w-2xl'}`}>
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-foreground/40 group-focus-within:text-accent transition-colors" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="block w-full pl-12 pr-32 py-3 bg-foreground/5 border border-border rounded-xl focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all text-base"
            />
            <button
              type="submit"
              disabled={isLoading || !url}
              className="absolute inset-y-1.5 right-1.5 px-5 bg-accent text-background font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Generate</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </form>

          {status && !result && (
            <p className={`mt-4 text-sm ${status.startsWith('Error') ? 'text-red-400' : 'text-accent animate-pulse'}`}>
              {status}
            </p>
          )}
        </div>

        {/* Results Area */}
        {result && (
          <div className="w-full space-y-6 animate-in">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-foreground/5 border border-border rounded-2xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('readme')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'readme' ? 'bg-accent text-background' : 'text-foreground/60 hover:text-foreground'}`}
                >
                  README.md
                </button>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'architecture' ? 'bg-accent text-background' : 'text-foreground/60 hover:text-foreground'}`}
                >
                  Architecture
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  title="Download .md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <div className="w-px h-6 bg-border mx-2" />
                <a
                  href={`https://github.com/${result.owner}/${result.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-foreground/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium text-accent"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              </div>
            </div>

            {/* Content Display */}
            <div className="min-h-[500px] p-8 bg-foreground/5 border border-border rounded-2xl overflow-auto shadow-2xl">
              {activeTab === 'readme' ? (
                <div className="prose prose-invert max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-accent">
                  <ReactMarkdown>{result.readme}</ReactMarkdown>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-accent mb-4">System Architecture</h3>
                  <Mermaid chart={result.architecture} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Initial Features Preview */}
        {!result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 w-full max-w-2xl">
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
        )}
      </div>

      <footer className="mt-auto py-12 text-foreground/40 text-sm">
        Built for developers who value their time.
      </footer>
    </main>
  );
}

