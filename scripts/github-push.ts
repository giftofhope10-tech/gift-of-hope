import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

async function getGitHubClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('GitHub integration not found');
  }

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );

  const data = await response.json();
  const connectionSettings = data.items?.[0];
  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error('GitHub not connected');
  }

  return new Octokit({ auth: accessToken });
}

async function pushToGitHub() {
  try {
    console.log('🔐 Authenticating with GitHub...');
    const octokit = await getGitHubClient();
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`✓ Authenticated as: ${user.login}\n`);

    const owner = user.login;
    const repo = 'gift-of-hope';

    console.log('📦 Checking repository...');
    try {
      await octokit.repos.get({ owner, repo });
      console.log(`✓ Repository exists: https://github.com/${owner}/${repo}\n`);
    } catch (error: any) {
      if (error.status === 404) {
        console.log('Creating repository...');
        await octokit.repos.createForAuthenticatedUser({
          name: repo,
          description: 'Gift of Hope - Nonprofit donation platform',
          private: false
        });
        console.log('✓ Repository created!\n');
      }
    }

    // Get all files
    console.log('📁 Scanning files...');
    const filesToUpload: string[] = [];
    
    const scanDirectory = (dir: string, base: string = '') => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = base ? `${base}/${item}` : item;
        
        if (fs.statSync(fullPath).isDirectory()) {
          if (!['node_modules', 'dist', '.git', 'attached_assets', '.vercel', 'scripts', '.local'].includes(item)) {
            scanDirectory(fullPath, relativePath);
          }
        } else if (!item.endsWith('.log')) {
          filesToUpload.push(relativePath);
        }
      }
    };

    // Add root files
    const rootFiles = ['package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.node.json', 
                       'vite.config.ts', 'vercel.json', 'drizzle.config.ts', '.gitignore', 
                       '.npmrc', 'README.md', '.env.example', 'PROJECT_SUMMARY.md', 
                       'DEPLOYMENT_AUDIT_REPORT.md', 'GITHUB_PUSH_INSTRUCTIONS.md', 'replit.md'];
    
    rootFiles.forEach(f => {
      if (fs.existsSync(f)) filesToUpload.push(f);
    });

    // Add directories
    ['client', 'server', 'shared', 'api'].forEach(dir => {
      if (fs.existsSync(dir)) scanDirectory(dir, dir);
    });

    console.log(`✓ Found ${filesToUpload.length} files\n`);

    // Upload files as blobs
    console.log('📤 Uploading files...');
    const blobs: { path: string; sha: string }[] = [];
    
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const content = fs.readFileSync(file);
      const { data: blob } = await octokit.git.createBlob({
        owner,
        repo,
        content: content.toString('base64'),
        encoding: 'base64'
      });
      
      blobs.push({ path: file, sha: blob.sha });
      process.stdout.write(`\r  Progress: ${i + 1}/${filesToUpload.length} files`);
    }
    console.log('\n✓ Files uploaded\n');

    // Get current state
    let baseTreeSha, parentSha;
    try {
      const { data: ref } = await octokit.git.getRef({ owner, repo, ref: 'heads/main' });
      parentSha = ref.object.sha;
      const { data: commit } = await octokit.git.getCommit({ owner, repo, commit_sha: parentSha });
      baseTreeSha = commit.tree.sha;
    } catch {}

    // Create tree
    console.log('🌳 Creating tree...');
    const { data: tree } = await octokit.git.createTree({
      owner,
      repo,
      tree: blobs.map(b => ({ path: b.path, mode: '100644' as const, type: 'blob' as const, sha: b.sha })),
      base_tree: baseTreeSha
    });

    // Create commit
    console.log('💾 Creating commit...');
    const { data: commit } = await octokit.git.createCommit({
      owner,
      repo,
      message: parentSha ? 'Update: Gift of Hope platform' : 'Initial commit: Gift of Hope donation platform',
      tree: tree.sha,
      parents: parentSha ? [parentSha] : []
    });

    // Update ref
    console.log('🚀 Pushing to main branch...');
    if (parentSha) {
      await octokit.git.updateRef({ owner, repo, ref: 'heads/main', sha: commit.sha });
    } else {
      await octokit.git.createRef({ owner, repo, ref: 'refs/heads/main', sha: commit.sha });
    }

    console.log('\n✅ SUCCESS! Code pushed to GitHub!\n');
    console.log(`🔗 Repository: https://github.com/${owner}/${repo}`);
    console.log(`📝 Commit: https://github.com/${owner}/${repo}/commit/${commit.sha.substring(0, 7)}`);
    console.log(`\n🎉 Ready to deploy to Vercel!`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    throw error;
  }
}

pushToGitHub();
