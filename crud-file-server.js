var http = require("http");
var fs = require('fs');

var cleanUrl = function(url) { 
	while(url.indexOf('.').length > 0) { url = url.replace('.', ''); }
	return url;
};

exports.handleRequest = function(port, path, req, res) {
	var writeError = function (err, code) { 
		console.log('writeError-->');
		console.log('err=' + err);
		console.log('code=' + code);
		code = code || 500;
		console.log('code1=' + code);
		console.log('Error ' + code + ': ' + err);
		try {
			res.statusCode = code;
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(err));	
		} catch(resErr) {
			console.log('failed to write error to response: ' + resErr);
		}
		console.log('writeError<--');
	};

	var parsedUrl = require('url').parse(req.url);
	var query = query ? {} : require('querystring').parse(parsedUrl.query);
    var url = cleanUrl(parsedUrl.pathname);	
	if(url.lastIndexOf('/') === url.length - 1) { url = url.slice(0, url.length ); }
	if(url[0] === '/') { url = url.slice(1, url.length);  }
	console.log(req.method + ' ' + req.url);
	var relativePath = path + url;	
	try {
		switch(req.method) {
			case 'GET':
				if(url === 'favicon.ico') { 	
					res.end();
				} else {
					fs.stat(relativePath, function(err, stats) { 
						if(err) { writeError(err); } 
						else {
							if(stats.isDirectory()) {
								console.log('reading directory ' + relativePath);
								fs.readdir(relativePath, function(err, files) {
									if(err) { writeError(err); }
									else {
										res.setHeader('Content-Type', 'application/json');
										res.end(JSON.stringify(files));
									}
								});
							} else {
								console.log('reading file ' + relativePath);
								var type = require('mime').lookup(relativePath);
								res.setHeader('Content-Type', type);
								fs.readFile(relativePath, function(err, data) { 
									if(err) { writeError(err); }
									else {
										res.end(data); 
									}
								});
							}
						}
					});
				}
				return;
			case 'PUT':
				console.log('writing ' + relativePath);
				var stream = fs.createWriteStream(relativePath);		
				stream.ok = true;
				req.pipe(stream); // TODO: limit data length
				req.on('end', function() {				
					if(stream.ok) {
						res.end();					
					}
				});
				stream.on('error', function(err) { 										
					stream.ok = false;
					writeError(err);
				});
				return;
			case 'POST':
				if(query.rename) {
					query.rename = cleanUrl(query.rename);
					console.log('renaming ' + relativePath + ' to ' + path + query.rename);
					fs.rename(relativePath, path + query.rename, function(err) {
						if(err) { writeError(err); } 
						else {
							res.end();
						}
					});
				} else if(query.create == 'directory') {
					console.log('creating directory ' + relativePath);
					fs.mkdir(relativePath, 0777, function(err) { 
						if(err) { writeError(err); } 
						else {
							res.end();
						}
					});
				} else {
					writeError('valid queries are ' + url + '?rename or ' + url + '?create=directory');
				}
				return;
			case 'DELETE':				
				fs.stat(relativePath, function(err, stats) { 
					if(err) { writeError(err); } 
					else {
						if(stats.isDirectory()) {
							console.log('deleting directory ' + relativePath);
							fs.rmdir(relativePath, function(err) {
								if(err) { writeError(err); }
								else { res.end(); }
							});
						} else {
							console.log('deleting file ' + relativePath);
							fs.unlink(relativePath, function(err) {
								if(err) { writeError(err); }
								else { res.end(); }
							});
						}
					}
				});			
				return;
			default:
				writeError('Method ' + method + ' not allowed', 405);
				return;
		}
	} catch(err) { 
		writeError('unhandled error: ' + err);
	}
};
