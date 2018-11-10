/**
 * 
 * @param {http request to log} request 
 */
function logRequest(req) {
    const { method, url, headers } = req;
    console.log(`HTTP Method:${method}\nURL:${url}`);
    console.log(`User agent:${headers['user-agent']}`);
    console.log(`Headers:${headers['rawHeaders']}`);
};


module.exports.logRequest = logRequest;