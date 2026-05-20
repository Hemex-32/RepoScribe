export interface RepoFile {
  path: string;
  content: string;
}

export interface RepoMetadata {
  language: string;
  stars: number;
  forks: number;
  description: string;
  size: number;
}

const IGNORED_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.tar.gz',
  '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.mov', '.wav', '.mp3'
];

const IGNORED_FILES = [
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'composer.lock',
  '.gitignore', '.gitattributes', '.env', '.env.local', 'DS_Store'
];

const IGNORED_DIRECTORIES = [
  'node_modules', '.git', 'dist', 'build', '.next', 'out', 'vendor', 'venv', '.cache'
];

export function shouldIgnore(path: string): boolean {
  const parts = path.split('/');
  const filename = parts[parts.length - 1].toLowerCase();
  
  // Ignore specific files
  if (IGNORED_FILES.includes(filename)) return true;
  
  // Ignore specific extensions
  if (IGNORED_EXTENSIONS.some(ext => filename.endsWith(ext))) return true;
  
  // Ignore specific directories
  if (parts.some(part => IGNORED_DIRECTORIES.includes(part))) return true;

  return false;
}

export async function fetchRepoMetadata(owner: string, repo: string): Promise<RepoMetadata> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'RepoScribe-App'
    }
  });

  if (!response.ok) throw new Error('Failed to fetch repository metadata');
  
  const data = await response.json();
  return {
    language: data.language || 'Unknown',
    stars: data.stargazers_count,
    forks: data.forks_count,
    description: data.description || '',
    size: data.size
  };
}

export async function fetchRepoContents(owner: string, repo: string, path: string = '', depth: number = 0): Promise<RepoFile[]> {
  if (depth > 3) return [];

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'RepoScribe-App'
    }
  });

  if (!response.ok) {
    if (response.status === 403) throw new Error('GitHub API rate limit exceeded.');
    throw new Error(`Failed to fetch repo: ${response.statusText}`);
  }

  const items = await response.json();
  let files: RepoFile[] = [];

  for (const item of items) {
    if (shouldIgnore(item.path)) continue;
    if (files.length > 50) break;

    if (item.type === 'file') {
      const fileResponse = await fetch(item.download_url);
      if (fileResponse.ok) {
        const content = await fileResponse.text();
        files.push({ path: item.path, content });
      }
    } else if (item.type === 'dir') {
      const subFiles = await fetchRepoContents(owner, repo, item.path, depth + 1);
      files = [...files, ...subFiles];
    }
  }

  return files;
}

export function parseGithubUrl(url: string) {
  try {
    const cleanedUrl = url.replace(/\/$/, '');
    const parts = cleanedUrl.split('/');
    const repoIndex = parts.indexOf('github.com');
    if (repoIndex === -1 || parts.length < repoIndex + 3) return null;
    
    return {
      owner: parts[repoIndex + 1],
      repo: parts[repoIndex + 2]
    };
  } catch (e) {
    return null;
  }
}
