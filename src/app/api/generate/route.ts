import { NextRequest, NextResponse } from 'next/server';
import { parseGithubUrl, fetchRepoContents } from '@/lib/github';
import { generateDocumentation } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const repoInfo = parseGithubUrl(url);
    if (!repoInfo) {
      return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
    }

    // Step 1: Fetching
    const files = await fetchRepoContents(repoInfo.owner, repoInfo.repo);

    if (files.length === 0) {
      return NextResponse.json({ error: 'Repository is empty or inaccessible' }, { status: 404 });
    }

    // Step 2: AI Analysis & Generation
    const documentation = await generateDocumentation(files);

    return NextResponse.json({ 
      success: true, 
      owner: repoInfo.owner, 
      repo: repoInfo.repo,
      fileCount: files.length,
      ...documentation
    });

  } catch (error: any) {
    console.error('Generation Error:', error);
    const message = error.message || 'An internal error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
