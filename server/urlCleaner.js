// don't let users crawl up the folder structure by using a/../../../c/d
exports.cleanUrl = function(url) { 
    while(url.indexOf('..').length > 0) { url = url.replace('..', ''); }
	return url;
};
