import { parseGithubUrl, fetchRepoContents, shouldIgnore } from './github.ts';

async function test() {
  console.log('--- Starting Phase 2 Verification ---');

  // Test 1: URL Parsing
  const testUrl = 'https://github.com/facebook/react';
  const repoInfo = parseGithubUrl(testUrl);
  console.log('Test 1 (URL Parsing):', repoInfo ? '✅ Success' : '❌ Failed');
  console.log('Parsed Info:', repoInfo);

  if (!repoInfo) return;

  // Test 2: Ignore Logic
  const filesToIgnore = ['node_modules/react/index.js', 'image.png', '.git/config', 'package-lock.json'];
  const filesToKeep = ['src/app/page.tsx', 'index.html', 'style.css'];
  
  const ignoreResults = filesToIgnore.every(f => shouldIgnore(f) === true);
  const keepResults = filesToKeep.every(f => shouldIgnore(f) === false);
  
  console.log('Test 2 (Filtering Logic):', (ignoreResults && keepResults) ? '✅ Success' : '❌ Failed');

  // Test 3: Live Fetching (Small Scope)
  console.log('Test 3 (Live Fetching): Attempting to fetch Portfolio repo...');
  try {
    // We'll just fetch the root to keep it fast and avoid rate limits during testing
    const files = await fetchRepoContents(repoInfo.owner, repoInfo.repo);
    console.log('✅ Success! Fetched', files.length, 'files.');
    console.log('Sample file paths:', files.slice(0, 5).map(f => f.path));
  } catch (error) {
    console.error('❌ Failed live fetch:', error);
  }

  console.log('--- Verification Complete ---');
}

test();
