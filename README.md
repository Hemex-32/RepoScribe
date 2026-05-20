# RepoScribe — AI-Driven Codebase Intelligence

<div align="center">
  <p><b>Transforming source code into professional documentation and visual architecture maps with a single click.</b></p>
  <a href="https://docugen-kappa.vercel.app/"><strong>Live Demo &rarr;</strong></a>
  <br />
  <br />
</div>

RepoScribe is a high-performance documentation engine designed for developers who value clarity over manual writing. Built with a premium **Silver & Obsidian** aesthetic, it leverages the **Gemini 2.5 Flash** model to synthesize complex codebases into human-readable technical specifications and dynamic architectural visualizations.

---

## ✨ Features

- **🚀 Intelligent Synthesis:** Automatically parses your GitHub repository and generates a comprehensive `README.md` covering architecture, setup, and core logic.
- **📊 Visual Architecture:** Real-time generation of Mermaid.js system maps, offering a high-level view of component dependencies and data flow.
- **💎 Premium UI/UX:** A bespoke 'Silver & Obsidian' theme featuring glassmorphism, mesh gradients, and floating micro-interactions for a superior developer experience.
- **⚡ Built for Speed:** Powered by Gemini 2.5 Flash with custom exponential backoff logic to ensure reliability even under high API demand.
- **📥 One-Click Export:** Seamlessly copy or download your generated documentation for immediate use in your project.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **AI Engine:** [Google Gemini 2.5 Flash](https://ai.google.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (Vanilla CSS Primitives)
- **Visualization:** [Mermaid.js](https://mermaid.js.org/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Google AI Studio API Key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hemex-32/DocuGen.git
   cd docugen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧠 How It Works

1. **Fetch:** RepoScribe securely retrieves your repository structure and core files via the GitHub API.
2. **Analyze:** The Gemini 2.5 Flash model processes the codebase context to identify patterns, tech stacks, and architectural flow.
3. **Generate:** The engine outputs a structured JSON object containing sanitized Markdown and Mermaid-compatible syntax.
4. **Render:** The UI applies glassmorphism effects and dynamic rendering to present the documentation in a polished, interactive interface.

---

<div align="center">
  Built for developers who value their time. &bull; 2026
</div>
