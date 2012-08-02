This package exposes a directory and its children to create, read, update, and delete operations over http.

Command-line usage
==================

     crud-file-server [options]

This starts a file server using the specified command-line options.

	-f: file system path to expose over http
	-p: port to listen on (example, 85)
	-q: suppress the help message


Server-Side Usage
=================

	require('http').createServer(function (req, res) {
		server.handleRequest(port, path, req, res);
	}).listen(port);
	
Supported operations
====================

**GET** returns a file's contents with the correct mime type, or else the contents of a directory as a JSON array.

**PUT** can be used to write a file.

**DELETE** can be used to delete a file or folder.

**POST** supports two operations, rename and create directory.  

POST http://localhost/newDir?create=directory would create a directory named newDir.  

POST http://localhost/abc.html?rename=def.html would rename abc.html to def.html.

Run the Example
===============

For further clarification, try running the example.

    npm install crud-file-server

Navigate to the example directory (which should now be under node_modules/crud-file-server/example).

	cd node_modules/crud-file-server/example

Run crud-file-server to host this directory. 

    crud-file-server -p 3300
    	
Now use your browser to navigate to http://localhost:3300/example.html.  
You will see a simple client that lets you interact with your file system from the web browser.


    


