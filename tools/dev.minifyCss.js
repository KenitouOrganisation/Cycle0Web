const fs = require('fs')
const {minify} = require('csso');

function MinifyCss(FILE_PATH) {
        
    const cssContent = fs.readFileSync(FILE_PATH, 'utf8');
    
    const result = minify(cssContent, {restructure: false}).css;

    fs.writeFileSync(FILE_PATH, result, 'utf8');

};


if(typeof require !== 'undefined' && require.main === module){
    if(process.argv && process.argv[2]) {
        MinifyCss(process.argv[2]);
    }else{
        throw new Error('Please provide a file path');
    }
}

module.exports = MinifyCss;