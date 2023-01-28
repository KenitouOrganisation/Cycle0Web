const fnm = './landing_clean/test1/folder2/myFile.txt';
const path = require('path')
const fs = require('fs')


console.log(
    path.relative("D:/julie/Documents/Dev/Cycle0/Cycle0Web/landing/cgu.html")
)

/*
try{

    console.log(fs.existsSync(path.dirname('./landing/src')))
    
    fs.writeFileSync(fnm, 'test prompt')
}catch(err){    
    console.error(err)
}*/