import { getUncachableGitHubClient } from '../server/github-client.js';

async function createRepo() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    const { data: user } = await octokit.users.getAuthenticated();
    console.log('✓ Authenticated as:', user.login);
    
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: 'gift-of-hope',
      description: 'Gift of Hope - Nonprofit donation platform with PayPal integration, built with React, TypeScript, Node.js, and PostgreSQL',
      private: false,
      auto_init: false,
      has_issues: true,
      has_projects: true,
      has_wiki: true
    });
    
    console.log('✓ Repository created successfully!');
    console.log('  Repository URL:', repo.html_url);
    console.log('  Clone URL:', repo.clone_url);
    console.log('  SSH URL:', repo.ssh_url);
    console.log('\nOwner:', user.login);
    console.log('Repo Name:', repo.name);
  } catch (error: any) {
    if (error.status === 422) {
      console.log('⚠ Repository already exists. Fetching existing repo...');
      const octokit = await getUncachableGitHubClient();
      const { data: user } = await octokit.users.getAuthenticated();
      const { data: repo } = await octokit.repos.get({
        owner: user.login,
        repo: 'gift-of-hope'
      });
      console.log('✓ Found existing repository');
      console.log('  Repository URL:', repo.html_url);
      console.log('  Clone URL:', repo.clone_url);
      console.log('  SSH URL:', repo.ssh_url);
      console.log('\nOwner:', user.login);
      console.log('Repo Name:', repo.name);
    } else {
      console.error('✗ Error:', error.message);
      throw error;
    }
  }
}

createRepo().catch(console.error);
