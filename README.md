Basic file server supporting create, read, update, &a delete

This package exposes a directory to create, read, update, delete operations.

Command-line usage
==================

     crud-file-server [options]

This starts a file server server using the specified command-line options.

	-f: file system path to expose over http
	-p: port to listen on (example, 85)
	-q: suppress the help message

Quickstart
==========

    npm install crud-file-server
    crud-file-server -p 85
	
Now, navigate to http://localhost:85 and you should see the contents of the current directory as a JSON array.

Server-Side Usage
=================

	require('http-proxy').createServer(function (req, res, proxy) {
		require('subproxy').handleRequest(subProxyHost, port, req, res, proxy);
	}).listen(port);
	
Supported operations
====================

**GET** returns a file's contents with the correct mime type, or else the contents of a directory as a JSON array.
**PUT** can be used to write a file.
**DELETE** can be used to delete a file or folder.
**POST** supports two operations, rename and create directory.  
For example, POST http://localhost/newDir?create=directory would create a directory named newDir.  
POST http://localhost/new-directory?create=directory would create a new directory named new-directory.

Run the Example
===============

For further clarification, try running the example:

    npm install crud-file-server

Navigate to the example directory (which should now be under node_modules/crud-file-server/example).

	cd node_modules/crud-file-server/example

Run crud-file-server to host this directory. 

    crud-file-server -p 3300
    	
Now use your browser to navigate to http://localhost:3300/example.html.  
You will see a simple client that lets you interact with your file system from the web browser.


    


