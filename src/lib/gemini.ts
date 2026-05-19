import { GoogleGenerativeAI } from "@google/generative-ai";
import { RepoFile } from './github';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateDocumentation(files: RepoFile[]) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
  });

  const codebaseContext = files
    .map((f) => `File: ${f.path}\nContent:\n${f.content}`)
    .join('\n\n---\n\n');

  const prompt = `
    You are an expert software architect and technical writer. 
    Analyze the following codebase and generate high-quality documentation.
    
    You must provide your response in valid JSON format with the following keys:
    1. "readme": A professional Markdown README.md including Project Name, Description, Key Features, Tech Stack, and Installation/Usage instructions.
    2. "architecture": A valid Mermaid.js graph TD or classDiagram representing the system architecture.
    
    Codebase:
    ${codebaseContext}
  `;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
  const response = await result.response;
  const text = response.text();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", text);
    throw new Error("AI returned invalid data format. Please try again.");
  }
}
