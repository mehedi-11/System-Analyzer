const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_MAIN = path.join(ROOT_DIR, 'dist/main');
const DIST_PRELOAD = path.join(ROOT_DIR, 'dist/preload');

function ensureDirectories() {
  if (!fs.existsSync(DIST_MAIN)) fs.mkdirSync(DIST_MAIN, { recursive: true });
  if (!fs.existsSync(DIST_PRELOAD)) fs.mkdirSync(DIST_PRELOAD, { recursive: true });

  // Copy migrations to dist/main/migrations
  const srcMigrations = path.join(ROOT_DIR, 'src/main/db/migrations');
  const destMigrations = path.join(DIST_MAIN, 'migrations');
  if (fs.existsSync(srcMigrations)) {
    if (!fs.existsSync(destMigrations)) fs.mkdirSync(destMigrations, { recursive: true });
    for (const file of fs.readdirSync(srcMigrations)) {
      fs.copyFileSync(path.join(srcMigrations, file), path.join(destMigrations, file));
    }
  }
}

async function buildMainAndPreload() {
  ensureDirectories();

  console.log('[Dev] Compiling Main process and Preload script with esbuild...');

  // Build Main
  await esbuild.build({
    entryPoints: [path.join(ROOT_DIR, 'src/main/index.ts')],
    outfile: path.join(DIST_MAIN, 'index.js'),
    bundle: true,
    platform: 'node',
    target: 'node20',
    sourcemap: true,
    external: ['electron', 'better-sqlite3']
  });

  // Build Preload
  await esbuild.build({
    entryPoints: [path.join(ROOT_DIR, 'src/preload/index.ts')],
    outfile: path.join(DIST_PRELOAD, 'index.js'),
    bundle: true,
    platform: 'node',
    target: 'node20',
    sourcemap: true,
    external: ['electron']
  });

  console.log('[Dev] Main and Preload build finished.');
}

function waitForViteServer(url = 'http://localhost:5173', timeoutMs = 20000) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, res => {
        resolve();
      }).on('error', () => {
        if (Date.now() - startTime > timeoutMs) {
          reject(new Error(`Timeout waiting for Vite dev server at ${url}`));
        } else {
          setTimeout(check, 300);
        }
      });
    };
    check();
  });
}

async function start() {
  ensureDirectories();

  // 1. Start Vite dev server
  console.log('[Dev] Starting Vite dev server on port 5173...');
  const viteBin = path.join(ROOT_DIR, '../node_modules/.bin/vite.cmd');
  const vite = spawn(`"${viteBin}"`, [], {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    shell: true
  });

  // 2. Wait for Vite server to become responsive
  await waitForViteServer();
  console.log('[Dev] Vite dev server is ready.');

  // 3. Compile main and preload
  await buildMainAndPreload();

  // 4. Start Electron
  console.log('[Dev] Spawning Electron application...');
  const electronBin = path.join(ROOT_DIR, '../node_modules/.bin/electron.cmd');
  const electronProcess = spawn(`"${electronBin}"`, ['.'], {
    cwd: ROOT_DIR,
    env: {
      ...process.env,
      NODE_ENV: 'development',
      VITE_DEV_SERVER_URL: 'http://localhost:5173'
    },
    stdio: 'inherit',
    shell: true
  });

  electronProcess.on('close', code => {
    console.log(`[Dev] Electron exited with code ${code}`);
    vite.kill();
    process.exit(code || 0);
  });
}

start().catch(err => {
  console.error('[Dev] Failed to start dev environment:', err);
  process.exit(1);
});
