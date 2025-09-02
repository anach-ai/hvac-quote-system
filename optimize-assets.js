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
        
        console.log(`✅ ${path.basename(filePath)}: ${originalSize}KB → ${minifiedSize}KB (${savings}% smaller)`);
        
        return { originalSize, minifiedSize, savings };
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return null;
    }
}

// Main optimization function
function optimizeAssets() {
    console.log('🚀 Starting asset optimization...\n');
    
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
    
    console.log('📁 Processing CSS files...');
    cssFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const result = processFile(file, minifyCSS);
            if (result) {
                totalOriginalSize += parseFloat(result.originalSize);
                totalMinifiedSize += parseFloat(result.minifiedSize);
            }
        }
    });
    
    console.log('\n📁 Processing JavaScript files...');
    jsFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const result = processFile(file, minifyJS);
            if (result) {
                totalOriginalSize += parseFloat(result.originalSize);
                totalMinifiedSize += parseFloat(result.minifiedSize);
            }
        }
    });
    
    console.log('\n📊 Optimization Summary:');
    console.log(`Total Original Size: ${totalOriginalSize.toFixed(2)}KB`);
    console.log(`Total Minified Size: ${totalMinifiedSize.toFixed(2)}KB`);
    console.log(`Total Savings: ${((totalOriginalSize - totalMinifiedSize) / totalOriginalSize * 100).toFixed(1)}%`);
    console.log('\n🎉 Asset optimization complete!');
    console.log('💡 Update your HTML files to use the .min versions for better performance.');
}

// Run optimization
optimizeAssets();
