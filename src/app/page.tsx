'use client';

import { useState } from 'react';
import { Github, FileText, Layout, Send, Loader2, Copy, Download, Check, ExternalLink, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Mermaid from '@/components/Mermaid';
import { motion, AnimatePresence } from 'framer-motion';

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-silver/5 blur-[120px] rounded-full pointer-events-none -z-10" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-obsidian/20 blur-[120px] rounded-full pointer-events-none -z-10" 
      />

      <div className={`w-full max-w-5xl space-y-12 transition-all duration-1000 ${result ? 'mt-8' : 'mt-24 flex flex-col items-center text-center'}`}>
        
        {/* Header Section */}
        <motion.div 
          layout
          className={`space-y-6 ${result ? 'text-left' : 'text-center'}`}
        >
          <div className={`flex ${result ? 'justify-start' : 'justify-center'}`}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-silver/20 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative p-4 glass-panel rounded-3xl animate-float">
                <FileText className="w-12 h-12 text-silver" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <motion.h1 
              layout
              className="text-5xl md:text-7xl font-bold tracking-tight uppercase leading-none font-sans"
            >
              <span className="silver-text">Repo</span>
              <span className="text-white/10 font-light">Scribe</span>
            </motion.h1>
            <AnimatePresence>
              {!result && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm md:text-base text-white/30 max-w-xl mx-auto leading-relaxed font-light font-sans tracking-tight"
                >
                  Architectural Intelligence <span className="text-white/10">&bull;</span> Automated Documentation
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Action Section */}
        <motion.div 
          layout
          className={`w-full transition-all duration-700 ${result ? 'max-w-xl' : 'max-w-2xl'}`}
        >
          <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-20">
              <Github className="h-5 w-5 text-white/20 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="github.com/username/repository"
              className="block w-full pl-14 pr-36 py-5 bg-white/[0.02] border border-white/10 rounded-2xl focus:border-white/30 focus:bg-white/[0.04] outline-none transition-all text-base placeholder:text-white/10 glass-panel relative z-10"
            />
            
            {/* Scanning AI Pulse Effect */}
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10"
                >
                  <div className="absolute inset-0 bg-silver/5 animate-scan w-1/3 h-full blur-xl skew-x-12" />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading || !url}
              className="absolute inset-y-2.5 right-2.5 px-8 bg-silver text-black font-black rounded-xl hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] z-20"
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

          <AnimatePresence>
            {status && !result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 flex flex-col items-center gap-3"
              >
                <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-silver w-full" 
                  />
                </div>
                <p className={`text-[10px] uppercase tracking-[0.3em] font-bold ${status.startsWith('Error') ? 'text-red-500' : 'text-white/30'}`}>
                  {status}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Display Section */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full space-y-8"
            >
              {/* Control Bar */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 glass-panel rounded-[2.5rem]"
              >
                <div className="flex items-center gap-3 p-1.5 bg-black/40 rounded-2xl border border-white/5 relative">
                  {/* Fluid Tab Indicator */}
                  <motion.div
                    initial={false}
                    animate={{ 
                      x: activeTab === 'readme' ? 0 : 'calc(100% + 12px)',
                      width: activeTab === 'readme' ? '125px' : '125px' // Approximate width
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-y-1.5 left-1.5 bg-silver rounded-xl z-0"
                    style={{ width: 'calc(50% - 9px)' }}
                  />
                  
                  <button
                    onClick={() => setActiveTab('readme')}
                    className={`relative z-10 px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'readme' ? 'text-black' : 'text-white/40 hover:text-white'}`}
                  >
                    Project Spec
                  </button>
                  <button
                    onClick={() => setActiveTab('architecture')}
                    className={`relative z-10 px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'architecture' ? 'text-black' : 'text-white/40 hover:text-white'}`}
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
              </motion.div>

              {/* Main Content Area */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="min-h-[700px] glass-panel rounded-[3rem] overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
                <div className="p-8 md:p-16 h-full overflow-auto relative z-10 custom-scrollbar">
                  <AnimatePresence mode="wait">
                    {activeTab === 'readme' ? (
                      <motion.div 
                        key="readme"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="prose prose-invert max-w-none font-sans
                          prose-pre:bg-black/50 prose-pre:backdrop-blur-md prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl
                          prose-headings:silver-text prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:font-serif
                          prose-p:text-white/60 prose-p:leading-relaxed prose-strong:text-white
                          prose-a:text-silver hover:prose-a:text-white transition-colors"
                      >
                        <ReactMarkdown>{result.readme}</ReactMarkdown>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="architecture"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-12"
                      >
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
        </AnimatePresence>

        {/* Landing Features */}
        {!result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16 w-full max-w-4xl px-4"
          >
            {[
              { 
                icon: FileText, 
                title: "Intelligent Analysis", 
                desc: "Deep synthesis of your source code into high-fidelity technical specifications.",
                sparkle: Sparkles
              },
              { 
                icon: Layout, 
                title: "Visual Mapping", 
                desc: "Live architectural rendering of dependencies and data flow through the system.",
                sparkle: Layout
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="p-10 glass-panel rounded-[2.5rem] text-left space-y-6 hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <feature.sparkle className="w-24 h-24 text-white" />
                </div>
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
