var http = require('http')
var fs = require('fs')
var url = require('url')
const { exit } = require('process')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号，比如\nnode server.js 8888')
    console.log('自动重启npx node-dev server.js 8888')
    process(exit)
}

var server = http.createServer(function(request, response) {
    var parseUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parseUrl.pathname
    var query = parseUrl.query
    var method = request.method

    console.log('请求来了，路径（带查询参数）为：' + pathWithQuery)

    response.statusCode = 200

    const filePath = path === '/' ? '/index.html' : path
    const index = filePath.lastIndexOf('.')
    const suffix = filePath.substring(index)
    const fileTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
    }
    response.setHeader('Content-Type', `${fileTypes[suffix || 'text/html']};charset=utf-8`)
    let Content
    try {
        content = fs.readFileSync(`./public${filePath}`)
    } catch (error) {
        content = '文件不存在'
        response.statusCode = 404
    }
    response.write(content)
    response.end()
})

server.listen(port)
console.log('监听' + port + '成功\n请打开http://localhost:' + port)