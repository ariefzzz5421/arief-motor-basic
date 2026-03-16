import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('dist');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const file of ['main.js', 'package.json']) {
  fs.copyFileSync(path.resolve(file), path.join(outDir, file));
}

const srcDir = path.resolve('src');
const distSrcDir = path.join(outDir, 'src');
fs.mkdirSync(distSrcDir, { recursive: true });

for (const file of fs.readdirSync(srcDir)) {
  fs.copyFileSync(path.join(srcDir, file), path.join(distSrcDir, file));
}

console.log('Build complete: dist/');
