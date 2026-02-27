import { execSync } from 'child_process';
try {
  execSync('npm install wagmi viem @web3modal/wagmi framer-motion sonner date-fns --legacy-peer-deps', { stdio: 'inherit' });
  console.log('Install success');
} catch (err) {
  console.error('Install failed', err);
}