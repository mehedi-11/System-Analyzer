const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_TESTS = path.join(ROOT_DIR, 'dist/tests');

async function compileTests() {
  if (!fs.existsSync(DIST_TESTS)) {
    fs.mkdirSync(DIST_TESTS, { recursive: true });
  }

  const testFiles = [
    path.join(ROOT_DIR, 'tests/database.test.ts'),
    path.join(ROOT_DIR, 'tests/collector.test.ts')
  ];

  await esbuild.build({
    entryPoints: testFiles,
    outdir: DIST_TESTS,
    bundle: true,
    platform: 'node',
    target: 'node20',
    sourcemap: 'inline',
    format: 'cjs',
    external: ['electron', 'better-sqlite3']
  });
}

async function run() {
  console.log('[Test Runner] Compiling test suites with esbuild...');
  await compileTests();

  console.log('[Test Runner] Executing test suites inside Electron runtime...');
  const electronBin = path.join(ROOT_DIR, '../node_modules/.bin/electron.cmd');

  const files = fs.readdirSync(DIST_TESTS).filter(f => f.endsWith('.test.js')).map(f => path.join(DIST_TESTS, f));

  const child = spawn(`"${electronBin}"`, ['--test', ...files.map(f => `"${f}"`)], {
    cwd: ROOT_DIR,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1'
    },
    stdio: 'inherit',
    shell: true
  });

  child.on('close', code => {
    process.exit(code || 0);
  });
}

run().catch(err => {
  console.error('[Test Runner] Failed to run tests:', err);
  process.exit(1);
});
