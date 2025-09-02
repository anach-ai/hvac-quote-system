const fs = require('fs');
const path = require('path');

// Simple minification function
function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around brackets, colons, semicolons, commas
        .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
        .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
        .trim();
}

function minifyJS(js) {
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around brackets, colons, semicolons, commas
        .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
        .replace(/\s*class\s+/g, ' class ') // Preserve class keyword spacing
        .replace(/\s*extends\s+/g, ' extends ') // Preserve extends keyword spacing
        .replace(/\s*super\s*\(/g, ' super(') // Preserve super() calls
        .replace(/\s*const\s+/g, ' const ') // Preserve const keyword spacing
        .replace(/\s*let\s+/g, ' let ') // Preserve let keyword spacing
        .replace(/\s*var\s+/g, ' var ') // Preserve var keyword spacing
        .replace(/\s*function\s+/g, ' function ') // Preserve function keyword spacing
        .replace(/\s*return\s+/g, ' return ') // Preserve return keyword spacing
        .replace(/\s*if\s*\(/g, ' if(') // Preserve if statement spacing
        .replace(/\s*else\s*{/g, ' else{') // Preserve else statement spacing
        .replace(/\s*for\s*\(/g, ' for(') // Preserve for loop spacing
        .replace(/\s*while\s*\(/g, ' while(') // Preserve while loop spacing
        .trim();
}

// Function to process files
function processFile(filePath, minifyFunction) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const minified = minifyFunction(content);
        const dir = path.dirname(filePath);
        const ext = path.extname(filePath);
        const name = path.basename(filePath, ext);
        const outputPath = path.join(dir, `${name}.min${ext}`);
        
        fs.writeFileSync(outputPath, minified);
        
        const originalSize = (content.length / 1024).toFixed(2);
        const minifiedSize = (minified.length / 1024).toFixed(2);
        const savings = ((content.length - minified.length) / content.length * 100).toFixed(1);
        
        
        
        return { originalSize, minifiedSize, savings };
    } catch (error) {
        
        return null;
    }
}

// Main optimization function
function optimizeAssets() {
    
    
    const cssFiles = [
        'assets/css/style.css',
        'assets/css/about-us.css',
        'assets/css/components.css',
        'assets/css/fixed-quote-summary.css'
    ];
    
    const jsFiles = [
        'assets/js/quote.js',
        'assets/js/StateManager.js',
        'assets/js/StateHooks.js',
        'assets/js/Validation.js',
        'assets/js/StateMiddleware.js',
        'assets/js/ErrorHandler.js',
        'assets/js/CardGrid.js',
        'assets/js/Modal.js',
        'assets/js/ComponentManager.js',
        'assets/js/StateSelectors.js',
        'assets/js/BaseComponent.js',
        'assets/js/EventManager.js',
        'assets/js/Storage.js',
        'assets/js/Card.js',
        'assets/js/ApiService.js',
        'assets/js/CardRenderer.js',
        'assets/js/VirtualRenderer.js',
        'assets/js/index.js'
    ];
    
    let totalOriginalSize = 0;
    let totalMinifiedSize = 0;
    
    
    cssFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const result = processFile(file, minifyCSS);
            if (result) {
                totalOriginalSize += parseFloat(result.originalSize);
                totalMinifiedSize += parseFloat(result.minifiedSize);
            }
        }
    });
    
    
    jsFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const result = processFile(file, minifyJS);
            if (result) {
                totalOriginalSize += parseFloat(result.originalSize);
                totalMinifiedSize += parseFloat(result.minifiedSize);
            }
        }
    });
    
    
}

// Run optimization
optimizeAssets();
