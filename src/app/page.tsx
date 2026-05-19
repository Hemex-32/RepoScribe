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
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <FileText className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Repo<span className="text-foreground/40 font-light not-italic">Scribe</span>
          </h1>
          {!result && (
            <p className="text-lg text-white/50 max-w-lg mx-auto leading-relaxed">
              AI-driven codebase documentation and visual architecture mapping.
            </p>
          )}
        </div>

        {/* Input Form */}
        <div className={`w-full ${result ? 'max-w-xl' : 'max-w-2xl'}`}>
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-white/20 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="github.com/username/repo"
              className="block w-full pl-12 pr-32 py-4 bg-white/[0.03] border border-white/10 rounded-xl focus:border-white/40 focus:bg-white/[0.05] outline-none transition-all text-base placeholder:text-white/20"
            />
            <button
              type="submit"
              disabled={isLoading || !url}
              className="absolute inset-y-2 right-2 px-6 bg-white text-black font-black rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Scribe</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </form>

          {status && !result && (
            <p className={`mt-6 text-[10px] uppercase tracking-[0.2em] font-bold ${status.startsWith('Error') ? 'text-red-500' : 'text-white/40 animate-pulse'}`}>
              {status}
            </p>
          )}
        </div>

        {/* Results Area */}
        {result && (
          <div className="w-full space-y-6 animate-in">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('readme')}
                  className={`px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'readme' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                >
                  README
                </button>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'architecture' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                >
                  Architecture
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-[10px] uppercase tracking-tighter font-bold text-white/60"
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-[10px] uppercase tracking-tighter font-bold text-white/60"
                  title="Download .md"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <a
                  href={`https://github.com/${result.owner}/${result.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-[10px] uppercase tracking-tighter font-bold text-white"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Repo</span>
                </a>
              </div>
            </div>

            {/* Content Display */}
            <div className="min-h-[600px] p-10 bg-white/[0.02] border border-white/5 rounded-3xl overflow-auto shadow-2xl">
              {activeTab === 'readme' ? (
                <div className="prose prose-invert max-w-none prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/5 prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-white/70 prose-accent">
                  <ReactMarkdown>{result.readme}</ReactMarkdown>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8">System Architecture Map</h3>
                  <Mermaid chart={result.architecture} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Initial Features Preview */}
        {!result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 w-full max-w-3xl">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-left space-y-4 hover:border-white/20 transition-all group">
              <FileText className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <h3 className="font-black text-xs uppercase tracking-widest">Documentation</h3>
              <p className="text-sm text-white/40 leading-relaxed">Comprehensive technical READMEs synthesized from your project structure and source logic.</p>
            </div>
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-left space-y-4 hover:border-white/20 transition-all group">
              <Layout className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <h3 className="font-black text-xs uppercase tracking-widest">Architecture</h3>
              <p className="text-sm text-white/40 leading-relaxed">Live visual mapping of component dependencies and data flow using Mermaid.js integration.</p>
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

