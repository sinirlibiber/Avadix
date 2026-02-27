const { execSync } = require('child_process');
try {
  execSync('npm install wagmi viem @web3modal/wagmi --legacy-peer-deps', { stdio: 'inherit' });
  console.log('Install success');
} catch (err) {
  console.error('Install failed', err);
}