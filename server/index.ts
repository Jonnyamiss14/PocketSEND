// This file is not used anymore - Next.js runs directly
// Keeping for compatibility with current package.json
// The project should ideally use: npm run dev -> next dev

import { spawn } from 'child_process';

const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000', '--hostname', '0.0.0.0'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

nextProcess.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Next.js process exited with code ${code}`);
    process.exit(code || 1);
  }
});
