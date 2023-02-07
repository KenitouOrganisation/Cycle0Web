const fs = require('fs')
const JavaScriptObfuscator = require('javascript-obfuscator');

function ObfuscFile(FILE_PATH) {
        
    const jsContent = fs.readFileSync(FILE_PATH, 'utf8');
    
    var obfuscationResult = JavaScriptObfuscator.obfuscate(
        jsContent,
        {
            optionsPreset: 'medium-obfuscation',
            compact: false,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1,
            disableConsoleOutput: true,
            transformObjectKeys: true,
            selfDefending: true,
        }
    );
    
    const result = obfuscationResult.getObfuscatedCode();
    
    fs.writeFileSync(FILE_PATH, result, 'utf8');

};

module.exports = ObfuscFile;

if(typeof require !== 'undefined' && require.main === module){
    if(process.argv && process.argv[2]) {
        ObfuscFile(process.argv[2]);
    }else{
        throw new Error('Please provide a file path');
    }
}