var fs = require('fs');
var error = require('./error.js');

exports.handleRequest = function(req, res, options, relativePath, query, url) {
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
		error.write(res, err);
	});
}