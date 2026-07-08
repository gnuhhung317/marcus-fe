import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const nodeBin = process.execPath;
const nextBin = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');
const mockApiProxy = path.join(rootDir, 'tests', 'e2e', 'mock-api-proxy.mjs');

const sharedEnv = {
  ...process.env,
  MOCK_API_PORT: process.env.MOCK_API_PORT ?? '4010',
};

const mockApiProcess = spawn(nodeBin, [mockApiProxy], {
  cwd: rootDir,
  env: sharedEnv,
  stdio: 'inherit',
});

const nextProcess = spawn(nodeBin, [nextBin, 'dev', '--hostname', '127.0.0.1', '--port', '3001'], {
  cwd: rootDir,
  env: sharedEnv,
  stdio: 'inherit',
});

const shutdown = () => {
  if (!mockApiProcess.killed) {
    mockApiProcess.kill('SIGTERM');
  }

  if (!nextProcess.killed) {
    nextProcess.kill('SIGTERM');
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const exitCode = await new Promise((resolve, reject) => {
  nextProcess.on('exit', (code, signal) => {
    shutdown();

    if (signal) {
      resolve(0);
      return;
    }

    resolve(code ?? 0);
  });

  mockApiProcess.on('exit', (code, signal) => {
    if (signal) {
      return;
    }

    if ((code ?? 0) !== 0) {
      shutdown();
      reject(new Error(`Mock API proxy exited with code ${code}`));
    }
  });

  nextProcess.on('error', (error) => {
    shutdown();
    reject(error);
  });

  mockApiProcess.on('error', (error) => {
    shutdown();
    reject(error);
  });
});

process.exit(exitCode);
