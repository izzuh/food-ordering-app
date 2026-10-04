import { spawn } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];

function start(name, args) {
  const child = spawn(npmCommand, args, { stdio: 'inherit', shell: false });
  child.on('exit', (code, signal) => {
    if (signal) console.log(`${name} stopped (${signal})`);
    else if (code !== 0) console.error(`${name} stopped with exit code ${code}`);
  });
  children.push(child);
}

start('Backend', ['--prefix', 'backend', 'run', 'dev']);
start('Mobile', ['--prefix', 'mobile', 'start']);

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);
