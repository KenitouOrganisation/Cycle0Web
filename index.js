const fs = require('fs')

const http = require('http')
const server = http.createServer((req, res)=>{

    let fileData = null
    const prefix = './landing'

    if(req.url == '/')
        fileData = GetFile(prefix, '/index.html')
    else
        fileData = GetFile(prefix, req.url)

    res.end(fileData)
})

server.listen(8080, '', '', console.log("\x1b[32mServer ready\x1b[0m"))

function GetFile(prefix, url){
    try{
        const val = fs.readFileSync(prefix + url)
        console.log("\x1b[32m>" + url + "\x1b[0m")
        return val
    }catch(err){
        console.log("\x1b[31mX" + url + "\x1b[0m")
        return err.toString()
    }
}