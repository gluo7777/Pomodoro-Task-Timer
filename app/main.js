// global constants
const hostname = 'localhost';
const port = 8080;
// import modules
const http = require('http');
const util = require('./modules/controller-util.js');
const handler = require('./modules/handler.js');

const server = http.createServer((req, res) => {
    util.logRequest(req);
    // fall back error handler
    res.on('error', err => {
        console.error(err);
        handler.doError(res);
    });
    const method = req.method;
    // handle http methods
    if (method === 'GET') {
        handler.doGet(req,res);
    } else {
        handler.doError(res,`${method} methods are not supported at this time.`);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});