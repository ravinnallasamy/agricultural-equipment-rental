/**
 * Production Cleanup Script
 * 
 * This script removes console statements and other development-only code
 * to prepare the application for production deployment.
 */

const fs = require('fs');
const path = require('path');

// Function to recursively find all JS/JSX files
function findJSFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findJSFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to clean console statements from a file
function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove console.log statements
    const consoleLogRegex = /^\s*console\.log\([^;]*\);\s*$/gm;
    if (consoleLogRegex.test(content)) {
      content = content.replace(consoleLogRegex, '');
      modified = true;
    }
    
    // Remove console.error statements (keep only in catch blocks)
    const consoleErrorRegex = /^\s*console\.error\([^;]*\);\s*$/gm;
    if (consoleErrorRegex.test(content)) {
      content = content.replace(consoleErrorRegex, '');
      modified = true;
    }
    
    // Remove console.warn statements
    const consoleWarnRegex = /^\s*console\.warn\([^;]*\);\s*$/gm;
    if (consoleWarnRegex.test(content)) {
      content = content.replace(consoleWarnRegex, '');
      modified = true;
    }
    
    // Remove empty lines that might be left behind
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Cleaned: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('🧹 Cleaning project for production deployment...');
  console.log('===============================================');
  
  const srcDir = path.join(__dirname, 'src');
  const jsFiles = findJSFiles(srcDir);
  
  let cleanedCount = 0;
  
  jsFiles.forEach(file => {
    if (cleanFile(file)) {
      cleanedCount++;
    }
  });
  
  console.log(`\n🎉 Production cleanup completed!`);
  console.log(`📁 Files processed: ${jsFiles.length}`);
  console.log(`🧹 Files cleaned: ${cleanedCount}`);
  console.log('\n✅ Your project is now ready for production deployment!');
}

// Run the script
main();
