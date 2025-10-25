import { getUncachableGitHubClient } from '../server/github-client.js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function pushToGitHub() {
  try {
    console.log('🔐 Authenticating with GitHub...');
    const octokit = await getUncachableGitHubClient();
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`✓ Authenticated as: ${user.login}\n`);

    const owner = user.login;
    const repo = 'gift-of-hope';

    // Check if repository exists
    console.log('📦 Checking repository...');
    let repoExists = false;
    try {
      await octokit.repos.get({ owner, repo });
      repoExists = true;
      console.log(`✓ Repository found: https://github.com/${owner}/${repo}\n`);
    } catch (error: any) {
      if (error.status === 404) {
        console.log('⚠ Repository not found. Creating it...');
        await octokit.repos.createForAuthenticatedUser({
          name: repo,
          description: 'Gift of Hope - Nonprofit donation platform with PayPal integration',
          private: false,
          auto_init: false
        });
        console.log(`✓ Repository created!\n`);
        repoExists = true;
      } else {
        throw error;
      }
    }

    // Get files to upload
    console.log('📁 Preparing files...');
    const filesToUpload = [
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'tsconfig.node.json',
      'vite.config.ts',
      'vercel.json',
      'drizzle.config.ts',
      '.gitignore',
      '.npmrc',
      'README.md',
      '.env.example',
      'PROJECT_SUMMARY.md',
      'DEPLOYMENT_AUDIT_REPORT.md',
      'GITHUB_PUSH_INSTRUCTIONS.md'
    ];

    // Get all files from directories
    const getDirectoryFiles = (dir: string, baseDir: string = ''): string[] => {
      const files: string[] = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(baseDir, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          if (!['node_modules', 'dist', '.git', 'attached_assets', '.vercel', 'scripts'].includes(item)) {
            files.push(...getDirectoryFiles(fullPath, relativePath));
          }
        } else {
          files.push(relativePath);
        }
      }
      return files;
    };

    filesToUpload.push(...getDirectoryFiles('client', 'client'));
    filesToUpload.push(...getDirectoryFiles('server', 'server'));
    filesToUpload.push(...getDirectoryFiles('shared', 'shared'));
    filesToUpload.push(...getDirectoryFiles('api', 'api'));

    console.log(`✓ Found ${filesToUpload.length} files to upload\n`);

    // Create blobs for each file
    console.log('📤 Uploading files to GitHub...');
    const blobs: { path: string; sha: string }[] = [];
    
    for (const file of filesToUpload) {
      if (!fs.existsSync(file)) continue;
      
      const content = fs.readFileSync(file);
      const { data: blob } = await octokit.git.createBlob({
        owner,
        repo,
        content: content.toString('base64'),
        encoding: 'base64'
      });
      
      blobs.push({ path: file, sha: blob.sha });
      process.stdout.write(`\r  Uploaded: ${blobs.length}/${filesToUpload.length} files`);
    }
    console.log('\n✓ All files uploaded\n');

    // Get the current commit SHA (if exists)
    let baseTreeSha: string | undefined;
    let parentSha: string | undefined;
    
    try {
      const { data: ref } = await octokit.git.getRef({
        owner,
        repo,
        ref: 'heads/main'
      });
      parentSha = ref.object.sha;
      
      const { data: commit } = await octokit.git.getCommit({
        owner,
        repo,
        commit_sha: parentSha
      });
      baseTreeSha = commit.tree.sha;
    } catch (error: any) {
      if (error.status !== 404) throw error;
      console.log('📝 Creating initial commit...');
    }

    // Create a tree
    console.log('🌳 Creating commit tree...');
    const { data: tree } = await octokit.git.createTree({
      owner,
      repo,
      tree: blobs.map(blob => ({
        path: blob.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blob.sha
      })),
      base_tree: baseTreeSha
    });

    // Create a commit
    const { data: commit } = await octokit.git.createCommit({
      owner,
      repo,
      message: parentSha ? 'Update: Gift of Hope donation platform' : 'Initial commit: Gift of Hope donation platform',
      tree: tree.sha,
      parents: parentSha ? [parentSha] : []
    });
    console.log('✓ Commit created\n');

    // Update the reference
    console.log('🚀 Pushing to GitHub...');
    if (parentSha) {
      await octokit.git.updateRef({
        owner,
        repo,
        ref: 'heads/main',
        sha: commit.sha
      });
    } else {
      await octokit.git.createRef({
        owner,
        repo,
        ref: 'refs/heads/main',
        sha: commit.sha
      });
    }

    console.log('\n✅ Successfully pushed to GitHub!\n');
    console.log(`📦 Repository: https://github.com/${owner}/${repo}`);
    console.log(`🔗 View commit: https://github.com/${owner}/${repo}/commit/${commit.sha}`);
    console.log(`\n🎉 Your code is now on GitHub!`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.status) {
      console.error(`   Status: ${error.status}`);
    }
    process.exit(1);
  }
}

pushToGitHub();
