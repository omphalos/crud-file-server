exports.write = function (res, err, code) { 
	code = code || 500;
	console.log('Error ' + code + ': ' + err);
	// write the error to the response, if possible
	try {			
		res.statusCode = code;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(err));	
	} catch(resErr) {
		console.log('failed to write error to response: ' + resErr);
	}
};

