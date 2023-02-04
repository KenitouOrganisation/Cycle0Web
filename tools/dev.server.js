const fs = require('fs')
const http = require('http')

let preRegCount = 53409;

function GetFile(prefix, url){
    try{
        const val = fs.readFileSync(prefix + url)
        console.log("\x1b[32m>" + url + "\x1b[0m")
        return {data : val, error : false}
    }catch(err){
        console.log("\x1b[31mX" + url + "\x1b[0m")
        return {data : err.toString(), error : true}
    }
}


const server = http.createServer((req, res)=>{

    let fileData = null
    const prefix = './landing'

    // removing versionning data/parameters ?v=999
    const url = req.url.replace(/\?v=(.+)/, '')

    if(url == '/')
        fileData = GetFile(prefix, '/index.html')
    // simulated request from Java Server
    else if(url == '/pre-registration/count')
        fileData = '' + preRegCount
    else if(url == '/pre-registration'){
        fileData = ''
        preRegCount++;
    }
    // end of simulated request
    else
        fileData = GetFile(prefix, url)

    if(url.endsWith(".svg"))
        res.setHeader('Content-type', 'image/svg+xml')

    if(fileData.error)
        res.statusCode = 404;

    res.end(fileData.data)
})

function LaunchHTTPServer(PORT=8081){
    server.listen(PORT, '', '', console.log(`\x1b[32mServer ready\x1b[0m http://localhost:${PORT}/`))
}

if(require.main === module){
    LaunchHTTPServer();
}

module.exports.LaunchHTTPServer = LaunchHTTPServer;