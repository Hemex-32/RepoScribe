'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Github, FileText, Layout, Send, Loader2, Copy, Download, 
  Check, ExternalLink, Sparkles, Terminal, Database, 
  Code2, Star, GitFork, ChevronDown, FileJson, FileCode
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Mermaid from '@/components/Mermaid';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'readme' | 'architecture'>('readme');
  const [isCopied, setIsCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const resetState = () => {
    setResult(null);
    setUrl('');
    setStatus('');
    setLogs([]);
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-4), `> ${message}`]);
  };

  useEffect(() => {
    // Removed auto-scroll to prevent page jumping
  }, [logs]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    setLogs([]);
    setResult(null);
    setStatus('Initializing documentation engine...');
    
    // Simulate terminal logs for UX
    const simulation = [
      { msg: 'Connecting to GitHub API...', delay: 500 },
      { msg: 'Resolving repository tree...', delay: 1200 },
      { msg: 'Analyzing source distribution...', delay: 2000 },
      { msg: 'Initializing Gemini 2.5 Flash...', delay: 3000 },
      { msg: 'Synthesizing architectural patterns...', delay: 4500 },
      { msg: 'Generating final documentation...', delay: 6000 }
    ];

    simulation.forEach(step => {
      setTimeout(() => addLog(step.msg), step.delay);
    });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate');

      setResult(data);
      addLog('Process completed successfully.');
      setStatus('Documentation generated successfully!');
    } catch (err: any) {
      console.error(err);
      addLog(`FATAL: ${err.message}`);
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (type: 'md' | 'json' | 'txt') => {
    if (!result) return;
    let content = result.readme;
    let filename = `README.${type}`;
    
    if (type === 'json') {
      content = JSON.stringify(result, null, 2);
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.readme);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="min-h-screen mesh-gradient text-foreground flex flex-col items-center px-4 md:px-6 overflow-x-hidden pb-20">
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-silver/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-obsidian/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Navigation - Top Left */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-8 left-8 z-50"
          >
            <button 
              onClick={resetState}
              className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 backdrop-blur-md"
            >
              <ChevronDown className="w-4 h-4 rotate-90 text-white/40 group-hover:text-white transition-colors" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 group-hover:text-white transition-colors">Home</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full max-w-5xl space-y-12 transition-all duration-1000 ${result ? 'mt-8' : 'mt-24 flex flex-col items-center text-center'}`}>
        
        {/* Header Section */}
        <div className={`space-y-6 ${result ? 'text-left w-full' : 'text-center'}`}>
          <div className={`flex ${result ? 'justify-start' : 'justify-center'}`}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-silver/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-4 glass-panel rounded-3xl animate-float">
                <FileText className="w-12 h-12 text-silver" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight uppercase leading-none font-sans">
              <span className="silver-text">Repo</span>
              <span className="text-white/10 font-light">Scribe</span>
            </h1>
            <AnimatePresence>
              {!result && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="text-sm md:text-base text-white/30 max-w-xl mx-auto leading-relaxed font-light font-sans tracking-tight">
                  Architectural Intelligence <span className="text-white/10">&bull;</span> Automated Documentation
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input & Terminal Section */}
        <div className={`w-full flex flex-col items-center gap-6 transition-all duration-700 ${result ? 'max-w-4xl' : 'max-w-2xl'}`}>
          <form onSubmit={handleGenerate} className="relative group w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-20">
              <Github className="h-5 w-5 text-white/20 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="github.com/username/repository"
              className="block w-full pl-14 pr-40 py-5 bg-white/[0.02] border border-white/10 rounded-2xl focus:border-white/30 focus:bg-white/[0.04] outline-none transition-all text-base placeholder:text-white/10 glass-panel relative z-10"
            />
            <AnimatePresence>
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
                  <div className="absolute inset-0 bg-silver/5 animate-scan w-1/3 h-full blur-xl skew-x-12" />
                </motion.div>
              )}
            </AnimatePresence>
            <button type="submit" disabled={isLoading || !url}
              className="absolute top-1/2 -translate-y-1/2 right-2.5 px-6 py-2.5 bg-silver text-black font-black rounded-xl hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] z-20 h-auto">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span className="hidden sm:inline">Initialize</span><Sparkles className="w-3 h-3" /></>}
            </button>
          </form>

          {/* AI Reasoning Terminal Overlay - Centered Below */}
          <AnimatePresence mode="wait">
            {(isLoading || logs.length > 0) && !result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }}
                className="w-full max-w-xl glass-panel rounded-2xl p-4 font-mono text-[10px] text-silver/60 flex flex-col gap-2 overflow-hidden border-white/5 min-h-[120px] max-h-[160px]"
              >
                <div className="flex items-center gap-2 border-b border-white/5 pb-2 shrink-0">
                  <Terminal className="w-3 h-3 text-silver/40" />
                  <span className="uppercase tracking-widest text-silver/30">Reasoning Engine</span>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar break-words whitespace-pre-wrap text-left">
                  {logs.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="mb-1 leading-relaxed">
                      {log}
                    </motion.div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Section */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="w-full space-y-6">
            
            {/* Repository Health Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Language', val: result.metadata?.language, icon: Code2 },
                { label: 'Stars', val: result.metadata?.stars?.toLocaleString(), icon: Star },
                { label: 'Forks', val: result.metadata?.forks?.toLocaleString(), icon: GitFork },
                { label: 'Files Analyzed', val: result.fileCount, icon: Database },
              ].map((stat, i) => (stat.val !== undefined && (
                <div key={i} className="p-4 glass-panel rounded-2xl flex items-center gap-4 group hover:border-white/20 transition-all">
                  <div className="p-2 bg-white/5 rounded-lg text-silver/40 group-hover:text-silver transition-colors">
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-bold">{stat.label}</p>
                    <p className="text-sm font-black text-silver leading-none mt-1">{stat.val}</p>
                  </div>
                </div>
              )))}
            </motion.div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 glass-panel rounded-[2.5rem]">
              <div className="flex items-center gap-3 p-1.5 bg-black/40 rounded-2xl border border-white/5 relative">
                <motion.div animate={{ x: activeTab === 'readme' ? 0 : 'calc(100% + 12px)' }}
                  className="absolute inset-y-1.5 left-1.5 bg-silver rounded-xl z-0 w-[calc(50%-9px)]" />
                <button onClick={() => setActiveTab('readme')}
                  className={`relative z-10 px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'readme' ? 'text-black' : 'text-white/40 hover:text-white'}`}>
                  Project Spec
                </button>
                <button onClick={() => setActiveTab('architecture')}
                  className={`relative z-10 px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'architecture' ? 'text-black' : 'text-white/40 hover:text-white'}`}>
                  System Map
                </button>
              </div>
              
              <div className="flex items-center gap-4 px-2">
                <button onClick={handleCopy}
                  className="p-3 hover:bg-white/5 rounded-xl transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-white">
                  {isCopied ? <Check className="w-4 h-4 text-silver" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isCopied ? 'Stored' : 'Copy'}</span>
                </button>

                {/* Multi-format Export Dropdown */}
                <div className="relative">
                  <button onClick={() => setShowExportMenu(!showExportMenu)}
                    className="p-3 hover:bg-white/5 rounded-xl transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-white">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showExportMenu && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 bottom-full mb-4 w-48 glass-panel rounded-2xl p-2 z-50 overflow-hidden">
                        {[
                          { label: 'Markdown (.md)', icon: FileCode, type: 'md' as const },
                          { label: 'Raw JSON (.json)', icon: FileJson, type: 'json' as const },
                          { label: 'Plain Text (.txt)', icon: FileText, type: 'txt' as const },
                        ].map((item, i) => (
                          <button key={i} onClick={() => handleExport(item.type)}
                            className="w-full p-3 hover:bg-white/5 rounded-xl flex items-center gap-3 text-[10px] font-bold text-white/60 hover:text-white transition-all text-left uppercase tracking-tighter">
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-px h-6 bg-white/10 mx-2" />
                <a href={`https://github.com/${result.owner}/${result.repo}`} target="_blank" rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-white">
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline">Source</span>
                  <ExternalLink className="w-3 h-3 opacity-30" />
                </a>
              </div>
            </div>

            {/* Main Content Area */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="min-h-[700px] glass-panel rounded-[3rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
              <div className="p-8 md:p-16 h-full overflow-auto relative z-10 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {activeTab === 'readme' ? (
                    <motion.div key="readme" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      className="prose prose-invert max-w-none font-sans
                        prose-pre:bg-black/50 prose-pre:backdrop-blur-md prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl
                        prose-headings:silver-text prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:font-serif
                        prose-p:text-white/60 prose-p:leading-relaxed prose-strong:text-white
                        prose-a:text-silver hover:prose-a:text-white transition-colors">
                      <ReactMarkdown>{result.readme}</ReactMarkdown>
                    </motion.div>
                  ) : (
                    <motion.div key="architecture" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-12">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/10" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">Core Architecture Graph</h3>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>
                      <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5">
                        <Mermaid chart={result.architecture} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Features Preview */}
        {!result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 w-full max-w-4xl px-4">
            {[
              { icon: FileText, title: "Intelligent Analysis", desc: "Deep synthesis of your source code into high-fidelity technical specifications." },
              { icon: Layout, title: "Visual Mapping", desc: "Live architectural rendering of dependencies and data flow through the system." }
            ].map((feature, i) => (
              <motion.div key={i} whileHover={{ y: -10, scale: 1.02 }} className="p-10 glass-panel rounded-[2.5rem] text-left space-y-6 hover:border-white/20 transition-all group relative overflow-hidden">
                <div className="p-4 bg-white/5 w-fit rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-8 h-8 text-silver" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-silver">{feature.title}</h3>
                  <p className="text-base text-white/30 leading-relaxed font-light">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <footer className="mt-auto py-16 text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">
        DocuGen Engine &bull; RepoScribe UI &bull; 2026
      </footer>
    </main>
  );
}
