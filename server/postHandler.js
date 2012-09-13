var fs = require('fs');
var error = require('./errorHandler.js');
var urlCleaner = require('./urlCleaner.js');

exports.hahandleRequest = function(req, res, options, relativePath, query, url) {
	if(query.rename) { // rename a file or directory
		console.log('rename: ' + relativePath);
		// e.g., http://localhost/old-name.html?rename=new-name.html
		query.rename = urlCleaner.cleanUrl(query.rename);
		// TODO: handle missing vpath here
		if(options.vpath) { 
			if(query.rename.indexOf('/' + options.vpath + '/') === 0) { 
				query.rename = query.rename.slice(options.vpath.length + 2, query.rename.length);
			} else {
				throw 'renamed url [' + query.rename + '] does not begin with vpath [' + options.vpath + ']';
			}
		} 
		console.log('renaming ' + relativePath + ' to ' + options.path + query.rename);
		fs.rename(relativePath, options.path + query.rename, function(err) {
			if(err) { error.write(res, err); } 
			else {
				res.end();
			}
		});
	} else if(query.create == 'directory') { // rename a directory
		// e.g., http://localhost/new-directory?create=directory
		console.log('creating directory ' + relativePath);
		fs.mkdir(relativePath, 777, function(err) { 
			if(err) { error.write(res, err); } 
			else {
				res.end();
			}
		});
	} else {
		console.log('relativePath: ' + relativePath);
		error.write(res, 'valid queries are ' + url + '?rename=[new name] or ' + url + '?create=directory');
	}

};