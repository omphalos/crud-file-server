var fs = require('fs');
var error = require('./error.js');
var mime = require('mime'); 
exports.handleRequest = function(req, res, options, relativePath, query) { 
	
    if(options.logHeadRequests) {
		console.log('head: ' + relativePath);				
	}
    
	fs.stat(relativePath, function(err, stats) { // determine if the resource is a file or directory
		if(err) { error.write(res, err); } 
		else {					
			res.setHeader('Last-Modified', stats.mtime);		
			if(stats.isDirectory()) {								
				res.setHeader('Content-Type', query.type == 'json' || query.dir == 'json' ? 'application/json' : 'text/html');
			} else {
				if(query.type == 'json' || query.dir == 'json') {
					res.setHeader('Content-Type', 'application/json');
				}
				else {
					var type = mime.lookup(relativePath);
					res.setHeader('Content-Type', type);
					res.setHeader('Content-Length', stats.size);
				}
			}
			res.end();							
		}
	});
};