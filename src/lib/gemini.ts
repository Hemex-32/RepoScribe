import { GoogleGenerativeAI } from "@google/generative-ai";
import { RepoFile } from './github';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateDocumentation(files: RepoFile[]) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
  });

  const codebaseContext = files
    .map((f) => `File: ${f.path}\nContent:\n${f.content}`)
    .join('\n\n---\n\n');

  const prompt = `
    You are an expert software architect and technical writer. 
    Analyze the following codebase and generate high-quality documentation.
    
    You must provide your response in valid JSON format with the following keys:
    1. "readme": A professional Markdown README.md including Project Name, Description, Key Features, Tech Stack, and Installation/Usage instructions.
    2. "architecture": A valid Mermaid.js graph TD or classDiagram. 
       IMPORTANT: 
       - DO NOT wrap the mermaid code in markdown code blocks (e.g., no \`\`\`mermaid).
       - Ensure all node labels with special characters or spaces are wrapped in double quotes.
       - The output must be a raw string that can be passed directly to the mermaid renderer.
    
    Codebase:
    ${codebaseContext}
  `;

  // Retry logic for 429 errors
  const maxRetries = 3;
  let retryCount = 0;
  let delay = 10000; // Start with 10 seconds (free tier needs more time)

  while (retryCount <= maxRetries) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1, // Lower temperature for more stable JSON
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
    } catch (error: any) {
      const errorText = error.message || "";
      const isQuotaError = errorText.includes('429') || errorText.toLowerCase().includes('quota');
      
      if (isQuotaError && retryCount < maxRetries) {
        // If the error specifies a wait time, try to extract it, otherwise use backoff
        console.log(`Quota exceeded. Retrying in ${delay/1000}s... (Attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        retryCount++;
        delay *= 2; // Exponential backoff (10s, 20s, 40s)
        continue;
      }
      
      console.error("Gemini API Error:", error);
      throw new Error(`Gemini API Error: ${errorText.slice(0, 100)}...`);
    }
  }
}
