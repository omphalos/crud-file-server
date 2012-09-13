var fs = require('fs');
var mime = require('mime');
var urlCleaner = require('./urlCleaner.js');
var error = require('./error.js');
var handlers = {
    'GET': require('./get.js'),
    'PUT': require('./put.js'),
    'POST': require('./post.js'),
    'DELETE': require('./delete.js'),
    'HEAD': require('./head.js')
};


/*
example usage:
	require('http').createServer(function (req, res) {
		server.handleRequest(req, res);
	}).listen(port);
*/
exports.handleRequest = function(req, res, options) {
	try {
        // vpath: (optional) virtual path to host in the url
        // path: the file system path to serve
        // readOnly: whether to allow modifications to the file

        options = options || {};
        options.port = options.port || 80;
        options.path = options.path || process.cwd();
        options.vpath = (options.vpath || '').trimLeft();

        if(options.path.lastIndexOf('/') !== options.path.length - 1) { options.path += '/'; } // make sure path ends with a slash
        var parsedUrl = require('url').parse(req.url);
        var query = query ? {} : require('querystring').parse(parsedUrl.query);
        var url = urlCleaner.cleanUrl(parsedUrl.pathname);

        // normalize the url such that there is no trailing or leading slash /
        if(url.lastIndexOf('/') === url.length - 1) { url = url.slice(0, url.length ); }
        if(url[0] === '/') { url = url.slice(1, url.length);  }

        // check that url begins with vpath
        if(options.vpath && url.indexOf(options.vpath) !== 0) {
            console.log('url does not begin with vpath');
            throw 'url [' + url + '] does not begin with vpath [' + options.vpath + ']';
        }

        var relativePath = options.vpath && url.indexOf(options.vpath) === 0 ?
            options.path + url.slice(options.vpath.length + 1, url.length):
            options.path + url;

        if(req.method != 'HEAD') {
            console.log(req.method + ' ' + req.url);
        }

		if(options.readOnly && req.method != 'GET') {
			error.write(res, req.method + ' forbidden on this resource', 403);
		} else {
            var handler = handlers[req.method];
            if(handler) {
                handler.handleRequest(req, res, options, relativePath, query, url);
            } else {
				console.log('unsupported: ' + relativePath);
				error.write(res, 'Method ' + req.method + ' not allowed', 405);
            }
		}
	} catch(err) {
		// file system ('fs') errors are just bubbled up to this error handler
		// for example, if the GET is called on a non-existent file, an error will be thrown
		// and caught here
		// writeError will write the error information to the response
		error.write(res, 'unhandled error: ' + err);
	}
};
