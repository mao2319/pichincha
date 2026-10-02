#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.production if they don't exist
const envFile = path.join(__dirname, '.env.production');
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  const lines = envContent.split('\n');

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Run Vite build
const { spawn } = require('child_process');
const vite = spawn('npx', ['vite', 'build'], { stdio: 'inherit' });

vite.on('close', (code) => {
  process.exit(code);
});
