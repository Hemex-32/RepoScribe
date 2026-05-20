'use client';

import { useState } from 'react';
import { Github, FileText, Layout, Send, Loader2, Copy, Download, Check, ExternalLink, Sparkles } from 'lucide-react';
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
    setStatus('Analyzing codebase & mapping architecture...');
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
    <main className="min-h-screen mesh-gradient text-foreground flex flex-col items-center px-4 md:px-6 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-silver/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-obsidian/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className={`w-full max-w-5xl space-y-12 transition-all duration-1000 ${result ? 'mt-8' : 'mt-24 flex flex-col items-center text-center'}`}>
        
        {/* Header Section */}
        <div className={`space-y-6 ${result ? 'text-left' : 'text-center'}`}>
          <div className={`flex ${result ? 'justify-start' : 'justify-center'}`}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-silver/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-4 glass-panel rounded-3xl animate-float">
                <FileText className="w-12 h-12 text-silver" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
              <span className="silver-text">Repo</span>
              <span className="text-white/20 font-light not-italic">Scribe</span>
            </h1>
            {!result && (
              <p className="text-lg md:text-xl text-white/40 max-w-xl mx-auto leading-relaxed font-light">
                Elevating source code into <span className="text-white font-medium">professional documentation</span> and visual architecture maps.
              </p>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div className={`w-full transition-all duration-700 ${result ? 'max-w-xl' : 'max-w-2xl'}`}>
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-white/20 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="github.com/username/repository"
              className="block w-full pl-14 pr-36 py-5 bg-white/[0.02] border border-white/10 rounded-2xl focus:border-white/30 focus:bg-white/[0.04] outline-none transition-all text-base placeholder:text-white/10 glass-panel"
            />
            <button
              type="submit"
              disabled={isLoading || !url}
              className="absolute inset-y-2.5 right-2.5 px-8 bg-silver text-black font-black rounded-xl hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Initialize</span>
                  <Sparkles className="w-3 h-3" />
                </>
              )}
            </button>
          </form>

          {status && !result && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-silver animate-progress w-1/2" />
              </div>
              <p className={`text-[10px] uppercase tracking-[0.3em] font-bold ${status.startsWith('Error') ? 'text-red-500' : 'text-white/30'}`}>
                {status}
              </p>
            </div>
          )}
        </div>

        {/* Display Section */}
        {result && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 glass-panel rounded-[2.5rem]">
              <div className="flex items-center gap-3 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                <button
                  onClick={() => setActiveTab('readme')}
                  className={`px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'readme' ? 'bg-silver text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  Project Spec
                </button>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === 'architecture' ? 'bg-silver text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  System Map
                </button>
              </div>
              
              <div className="flex items-center gap-4 px-2">
                <button
                  onClick={handleCopy}
                  className="p-3 hover:bg-white/5 rounded-xl transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-white"
                >
                  {isCopied ? <Check className="w-4 h-4 text-silver" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isCopied ? 'Stored' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="p-3 hover:bg-white/5 rounded-xl transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <a
                  href={`https://github.com/${result.owner}/${result.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-white"
                >
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline">Source</span>
                  <ExternalLink className="w-3 h-3 opacity-30" />
                </a>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="min-h-[700px] glass-panel rounded-[3rem] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
              <div className="p-8 md:p-16 h-full overflow-auto relative z-10 custom-scrollbar">
                {activeTab === 'readme' ? (
                  <div className="prose prose-invert max-w-none 
                    prose-pre:bg-black/50 prose-pre:backdrop-blur-md prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl
                    prose-headings:silver-text prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase
                    prose-p:text-white/60 prose-p:leading-relaxed prose-strong:text-white
                    prose-a:text-silver hover:prose-a:text-white transition-colors">
                    <ReactMarkdown>{result.readme}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="space-y-12 animate-in fade-in duration-700">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">Core Architecture Graph</h3>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5">
                      <Mermaid chart={result.architecture} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Landing Features */}
        {!result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 w-full max-w-4xl px-4">
            <div className="p-10 glass-panel rounded-[2.5rem] text-left space-y-6 hover:border-white/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-24 h-24 text-white" />
              </div>
              <div className="p-4 bg-white/5 w-fit rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <FileText className="w-8 h-8 text-silver" />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-silver">Intelligent Analysis</h3>
                <p className="text-base text-white/30 leading-relaxed font-light">Deep synthesis of your source code into high-fidelity technical specifications.</p>
              </div>
            </div>
            
            <div className="p-10 glass-panel rounded-[2.5rem] text-left space-y-6 hover:border-white/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Layout className="w-24 h-24 text-white" />
              </div>
              <div className="p-4 bg-white/5 w-fit rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <Layout className="w-8 h-8 text-silver" />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-silver">Visual Mapping</h3>
                <p className="text-base text-white/30 leading-relaxed font-light">Live architectural rendering of dependencies and data flow through the system.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-auto py-16 text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">
        DocuGen Engine &bull; RepoScribe UI &bull; 2026
      </footer>
    </main>
  );
}
