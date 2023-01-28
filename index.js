const { LaunchHTTPServer } = require('./tools/dev.server')
const GenerateStaticHTML = require('./tools/dev.pushDynamicHtml')

LaunchHTTPServer();
GenerateStaticHTML();