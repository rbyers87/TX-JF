#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixAssetPaths() {
  const distPath = path.join(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found in dist folder');
    return;
  }
  
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Fix absolute paths to relative paths
  indexContent = indexContent.replace(/href="\//g, 'href="./');
  indexContent = indexContent.replace(/src="\//g, 'src="./');
  
  // Fix any remaining absolute _expo paths
  indexContent = indexContent.replace(/href="\/_expo/g, 'href="./_expo');
  indexContent = indexContent.replace(/src="\/_expo/g, 'src="./_expo');
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('Fixed asset paths in index.html');
}

fixAssetPaths();
