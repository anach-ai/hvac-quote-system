const fs = require('fs');
const path = require('path');

// Simple but safe minification functions
function safeMinifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around brackets, colons, semicolons, commas
        .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
        .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
        .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
        .trim();
}

function safeMinifyJS(js) {
    // More conservative JavaScript minification that preserves ES6 syntax
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around brackets, colons, semicolons, commas
        .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
        .replace(/\s*class\s+/g, ' class ') // Preserve class keyword
        .replace(/\s*extends\s+/g, ' extends ') // Preserve extends keyword
        .replace(/\s*super\s*\(/g, ' super(') // Preserve super() calls
        .replace(/\s*const\s+/g, ' const ') // Preserve const keyword
        .replace(/\s*let\s+/g, ' let ') // Preserve let keyword
        .replace(/\s*var\s+/g, ' var ') // Preserve var keyword
        .replace(/\s*function\s+/g, ' function ') // Preserve function keyword
        .replace(/\s*return\s+/g, ' return ') // Preserve return keyword
        .replace(/\s*if\s*\(/g, ' if(') // Preserve if statement
        .replace(/\s*else\s*{/g, ' else{') // Preserve else statement
        .replace(/\s*for\s*\(/g, ' for(') // Preserve for loop
        .replace(/\s*while\s*\(/g, ' while(') // Preserve while loop
        .replace(/\s*new\s+/g, ' new ') // Preserve new keyword
        .replace(/\s*import\s+/g, ' import ') // Preserve import keyword
        .replace(/\s*export\s+/g, ' export ') // Preserve export keyword
        .replace(/\s*default\s+/g, ' default ') // Preserve default keyword
        .replace(/\s*async\s+/g, ' async ') // Preserve async keyword
        .replace(/\s*await\s+/g, ' await ') // Preserve await keyword
        .replace(/\s*=>\s*/g, ' => ') // Preserve arrow function syntax
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

// Function to validate JavaScript syntax
function validateJavaScript(jsContent, fileName) {
    try {
        // Basic syntax check - try to parse the JavaScript
        new Function(jsContent);
        console.log(`✅ ${fileName}: JavaScript syntax is valid`);
        return true;
    } catch (error) {
        console.error(`❌ ${fileName}: JavaScript syntax error - ${error.message}`);
        return false;
    }
}

// Main optimization function
function optimizeAssets() {
    console.log('🚀 Starting safe asset optimization...\n');
    
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
    let jsValidationPassed = true;
    
    console.log('📁 Processing CSS files...');
    cssFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const result = processFile(file, safeMinifyCSS);
            if (result) {
                totalOriginalSize += parseFloat(result.originalSize);
                totalMinifiedSize += parseFloat(result.minifiedSize);
            }
        }
    });
    
    console.log('\n📁 Processing JavaScript files...');
    jsFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const result = processFile(file, safeMinifyJS);
            if (result) {
                totalOriginalSize += parseFloat(result.originalSize);
                totalMinifiedSize += parseFloat(result.minifiedSize);
                
                // Validate the minified JavaScript
                const minifiedPath = file.replace('.js', '.min.js');
                if (fs.existsSync(minifiedPath)) {
                    const minifiedContent = fs.readFileSync(minifiedPath, 'utf8');
                    if (!validateJavaScript(minifiedContent, path.basename(minifiedPath))) {
                        jsValidationPassed = false;
                    }
                }
            }
        }
    });
    
    console.log('\n📊 Optimization Summary:');
    console.log(`Total Original Size: ${totalOriginalSize.toFixed(2)}KB`);
    console.log(`Total Minified Size: ${totalMinifiedSize.toFixed(2)}KB`);
    console.log(`Total Savings: ${((totalOriginalSize - totalMinifiedSize) / totalOriginalSize * 100).toFixed(1)}%`);
    
    if (jsValidationPassed) {
        console.log('\n🎉 Asset optimization complete! All JavaScript files are syntactically valid.');
        console.log('💡 Update your HTML files to use the .min versions for better performance.');
    } else {
        console.log('\n⚠️  Asset optimization complete, but some JavaScript files have syntax errors.');
        console.log('💡 Check the errors above and fix them before using the minified versions.');
    }
}

// Run optimization
optimizeAssets();
