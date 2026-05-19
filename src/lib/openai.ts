import OpenAI from 'openai';
import { RepoFile } from './github';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDocumentation(files: RepoFile[]) {
  const codebaseContext = files
    .map((f) => `File: ${f.path}\nContent:\n${f.content}`)
    .join('\n\n---\n\n');

  const systemPrompt = `
    You are an expert software architect and technical writer. 
    Your task is to analyze a codebase and generate high-quality documentation.
    
    You must provide your response in valid JSON format with the following keys:
    1. "readme": A professional Markdown README.md including Project Name, Description, Key Features, Tech Stack, and Installation/Usage instructions.
    2. "architecture": A valid Mermaid.js classDiagram or graph TD representing the system architecture.
    
    Be concise but thorough. Focus on the core logic and structure of the application.
  `;

  const userPrompt = `
    Analyze the following codebase and generate a README.md and a Mermaid architecture diagram.
    
    Codebase:
    ${codebaseContext}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('Failed to generate documentation from OpenAI');

  return JSON.parse(content);
}
