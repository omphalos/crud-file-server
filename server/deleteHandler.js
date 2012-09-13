var fs = require('fs');
var error = require('./error.js');

exports.handleRequest = function(req, res, options, relativePath) {
	fs.stat(relativePath, function(err, stats) { 
		if(err) { error.write(res, err); } 
		else {
			if(stats.isDirectory()) { // delete a directory
				console.log('deleting directory ' + relativePath);
				fs.rmdir(relativePath, function(err) {
					if(err) { error.write(res, err); }
					else { 
						res.end(); 
					}
				});
			} else { // delete a file
				console.log('deleting file ' + relativePath);
				fs.unlink(relativePath, function(err) {
					if(err) { error.write(res, err); }
					else { 
						res.end(); 
					}
				});
			}
		}
	});			
};