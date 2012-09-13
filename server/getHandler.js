var fs = require('fs');
var mime = require('mime');
var error = require('./error.js');

exports.handleRequest = function(req, res, options, relativePath, query, url) {
    console.log('relativePath: ' + relativePath);
	if(url === 'favicon.ico') {
		res.end(); // if the browser requests favicon, just return an empty response
	} else {
		fs.stat(relativePath, function(err, stats) { // determine if the resource is a file or directory
			if(err) { error.write(res, err); } 
			else {
				if(stats.isDirectory()) {
					res.setHeader('Last-Modified', stats.mtime);							
					// if it's a directory, return the files as a JSONified array
					console.log('reading directory ' + relativePath);
					fs.readdir(relativePath, function(err, files) {
						if(err) { 
							console.log('writeError');
							error.write(res, err); 
						}
						else {
							var results = [];
							var search = {};
							search.stats = function(files) {
								if(files.length) { 
									var file = files.shift();
									fs.stat(relativePath + '/' + file, function(err, stats) { 
										if(err) { error.write(res, err); } 
										else {
											stats.name = file;
											stats.isFile = stats.isFile();
											stats.isDirectory = stats.isDirectory();
											stats.isBlockDevice = stats.isBlockDevice();
											stats.isFIFO = stats.isFIFO();
											stats.isSocket = stats.isSocket();
											results.push(stats);
											search.stats(files);															
										}
									});
								} else {
									if(query.dir == 'json') {
										res.setHeader('Content-Type', 'application/json');
										res.write(JSON.stringify(results)); 
										res.end();
									} else { 
										res.setHeader('Content-Type', 'text/html');											
										res.write('<html><body>');
										for(var f = 0; f < results.length; f++) {
											var name = results[f].name;
											var normalized = url + '/' + name;
											while(normalized[0] == '/') { normalized = normalized.slice(1, normalized.length); }
											res.write('\r\n<p><a href="/' + normalized + '">' + name + '</a></p>');
										}
										res.end('\r\n</body></html>');
									}
								}
							};
							search.stats(files);
						}
					});
				} else {
					// if it's a file, return the contents of a file with the correct content type
					console.log('reading file ' + relativePath);
                    var type;
					if(query.type == 'json' || query.dir == 'json') {
						type = 'application/json';
						res.setHeader('Content-Type', type);
						fs.readFile(relativePath, function(err, data) { 
							if(err) { error.write(res, err); }
							else {
								res.end(JSON.stringify({ 
									data: data.toString(),
									type: mime.lookup(relativePath)
								})); 
							}
						});
					} else {
						type = mime.lookup(relativePath);
						res.setHeader('Content-Type', type);
						fs.readFile(relativePath, function(err, data) { 
							if(err) { error.write(res, err); }
							else {
								res.setHeader('Content-Length', data.length);
								res.end(data); 
							}
						});
					}
				}
			}
		});
	}
};