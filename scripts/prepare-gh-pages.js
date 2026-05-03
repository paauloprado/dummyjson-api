const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');
const notFoundPath = path.join(distPath, '404.html');
const homepage = packageJson.homepage || '';
const basePath = homepage ? new URL(homepage).pathname.replace(/\/?$/, '/') : '/';

let html = fs.readFileSync(indexPath, 'utf8');

html = html
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/src="\/_expo\//g, `src="${basePath}_expo/`)
  .replace(/\n\s*\n/g, '\n');

fs.writeFileSync(indexPath, html);
fs.writeFileSync(notFoundPath, html);
