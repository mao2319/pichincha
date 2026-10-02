import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.production if they don't exist
const envFile = path.join(__dirname, '.env.production');
if (fs.existsSync(envFile)) {
  console.log('Loading environment variables from .env.production...');
  const envContent = fs.readFileSync(envFile, 'utf8');
  const lines = envContent.split('\n');

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex !== -1) {
        const key = trimmed.substring(0, equalsIndex);
        const value = trimmed.substring(equalsIndex + 1);
        if (key && !process.env[key]) {
          process.env[key] = value;
          console.log(`  Set ${key}=${value.substring(0, 20)}...`);
        }
      }
    }
  });
  console.log('Environment variables loaded successfully.\n');
} else {
  console.log('Warning: .env.production not found, using system environment variables\n');
}

// Run Vite build
try {
  console.log('Starting Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
