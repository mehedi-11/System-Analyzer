const { execSync } = require('child_process');
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

async function build() {
  console.log('[Build] Cleaning and preparing dist directories...');
  ensureDirectories();

  console.log('[Build] Compiling React renderer with Vite...');
  execSync('npx vite build', { cwd: ROOT_DIR, stdio: 'inherit' });

  console.log('[Build] Compiling Main process with esbuild...');
  await esbuild.build({
    entryPoints: [path.join(ROOT_DIR, 'src/main/index.ts')],
    outfile: path.join(DIST_MAIN, 'index.js'),
    bundle: true,
    platform: 'node',
    target: 'node20',
    sourcemap: true,
    minify: false,
    external: ['electron', 'better-sqlite3']
  });

  console.log('[Build] Compiling Preload script with esbuild...');
  await esbuild.build({
    entryPoints: [path.join(ROOT_DIR, 'src/preload/index.ts')],
    outfile: path.join(DIST_PRELOAD, 'index.js'),
    bundle: true,
    platform: 'node',
    target: 'node20',
    sourcemap: true,
    minify: false,
    external: ['electron']
  });

  console.log('[Build] Production build completed successfully!');
}

build().catch(err => {
  console.error('[Build] Build failed:', err);
  process.exit(1);
});

