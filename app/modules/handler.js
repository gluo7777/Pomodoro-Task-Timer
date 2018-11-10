/**
 * Module for handling HTTP requests.
 * @todo: Could be enhanced by loading all file paths into memory
 * and using that to check for valid instead of using regex. Use 
 * regex or contains only on last path element (file) to determine 
 * proper mime type
 */

module.exports.doGet = doGet;
module.exports.doError = sendError;
const fs = require('fs');
// other
const HOST = 'http://localhost';

/**
 * 
 * @param {http GET request} req 
 * @param {sends back html or js} res 
 */
function doGet(req,res) {
    const fullUrl = new URL(req.url, HOST);
    const url = fullUrl.pathname;
    const filePath = url.length >= 2 ? url.substr(1) : url;
    console.log(`File:${filePath}\tExists:${fs.existsSync(filePath)}`);
    // home page
    if (url === '/' || url === '/home') {
        sendFile(res, 'index.html');
    }else{
        // determine content type
        const contentType = getContentType(filePath);
        if(contentType && isValidPath(filePath)){
            sendFile(res, filePath, contentType);
        }
        else {
            console.log(`Path '${filePath}' failed to matched any handlers.`)
            sendError(res);
        }
    }
}

const IMG = ['png','jpeg','gif'];

function getContentType(url){
    const paths = url.split('/');
    const file = paths[paths.length-1];
    if(hasExtension(file,'html')){
        return 'text/html';
    } else if(hasExtension(file,'css')){
        return 'text/css';
    } else if(hasExtension(file,'js')){
        return 'application/javascript';
    } else{
        for(i of IMG){
            if(hasExtension(file,i)){
                return `image/${i}`;
            }
        }
    }
    return null;
}

function hasExtension(file, ext) {
    return new RegExp(`^[a-zA-Z0-9-_]+\\.${ext}$`).test(file);
}

const PATHS = ['','scripts','assets'];

function isValidPath(path) {
    const realPath = fs.realpathSync(path);
    if(!/\.*\.{2}\.*/.test(realPath)){
        const root = realPath.split('/')[0];
        for(path of PATHS){
            if(path === root)
                return true;
        }
    }
    return false;
}

function sendFile(res, file, contentType='text/html') {
    fs.readFile(file, (error, page) => {
        if (error) {
            console.log(error);
            sendError(res);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.write(page);
            res.end();
        }
    });
}

/**
 * 
 * @param {response to write error page} res 
 */
function sendError(res,msg='Some msg.') {
    fs.readFile('error.html', (error, page) => {
        res.statusCode = 404;
        if (error) {
            console.error(error);
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.write(page);
        }
        res.end();
    });
}