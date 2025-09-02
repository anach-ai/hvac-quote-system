const fs = require('fs');
const path = require('path');

// Function to remove console statements from JavaScript files
function removeConsoleStatements(content) {
    // Remove console.log, console.error, console.warn, console.info, console.debug
    return content
        .replace(/console\.log\([^)]*\);?\s*/g, '')
        .replace(/console\.error\([^)]*\);?\s*/g, '')
        .replace(/console\.warn\([^)]*\);?\s*/g, '')
        .replace(/console\.info\([^)]*\);?\s*/g, '')
        .replace(/console\.debug\([^)]*\);?\s*/g, '')
        .replace(/console\.log\([^)]*\)\s*/g, '')
        .replace(/console\.error\([^)]*\)\s*/g, '')
        .replace(/console\.warn\([^)]*\)\s*/g, '')
        .replace(/console\.info\([^)]*\)\s*/g, '')
        .replace(/console\.debug\([^)]*\)\s*/g, '');
}

// Function to process a file
function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const cleanedContent = removeConsoleStatements(content);
        
        if (content !== cleanedContent) {
            fs.writeFileSync(filePath, cleanedContent);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        
        return false;
    }
}

// Function to process all JavaScript files in a directory
function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    let cleanedCount = 0;
    
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            cleanedCount += processDirectory(filePath);
        } else if (file.endsWith('.js')) {
            if (processFile(filePath)) {
                cleanedCount++;
            }
        }
    });
    
    return cleanedCount;
}

// Main execution
    

const jsDir = path.join(__dirname, 'assets', 'js');
if (fs.existsSync(jsDir)) {
    const cleanedCount = processDirectory(jsDir);
    
} else {
    
}

// Also clean the main quote.js file
const quoteJsPath = path.join(__dirname, 'assets', 'js', 'quote.js');
if (fs.existsSync(quoteJsPath)) {
    if (processFile(quoteJsPath)) {
        
    }
}
