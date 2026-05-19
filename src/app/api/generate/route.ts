import { NextRequest, NextResponse } from 'next/server';
import { parseGithubUrl, fetchRepoContents } from '@/lib/github';

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

    // Step 1: Fetching (Phase 2)
    // We fetch a maximum number of files/size for the prototype to avoid timeouts
    const files = await fetchRepoContents(repoInfo.owner, repoInfo.repo);

    if (files.length === 0) {
      return NextResponse.json({ error: 'Repository is empty or inaccessible' }, { status: 404 });
    }

    // Step 2: Analysis & Generation (Phase 3 placeholder)
    // For now, we return the file count as a success indicator for Phase 2
    return NextResponse.json({ 
      success: true, 
      owner: repoInfo.owner, 
      repo: repoInfo.repo,
      fileCount: files.length,
      message: 'Codebase fetched successfully. Ready for AI analysis.'
    });

  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: error.message || 'An internal error occurred' }, { status: 500 });
  }
}
