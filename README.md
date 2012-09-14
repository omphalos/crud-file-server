[![build status](https://secure.travis-ci.org/omphalos/crud-file-server.png)](http://travis-ci.org/omphalos/crud-file-server)
crud-file-server
================

This package exposes a directory and its children to create, read, update, and delete operations over http.

Command-line usage
==================

     crud-file-server [options]

This starts a file server using the specified command-line options.

    -f file system path to expose over http
	-h log head requests
    -p port to listen on (example, 80)
    -q suppress this message
	-r read only
    -v virtual path to host the file server on	
	
Example:

    crud-file-server -f c:/ -p 8080 -q -v filez	

Supported operations
====================

**GET** returns a file's contents with the correct mime type, or else the contents of a directory as html.

**GET** http://localhost?type=json formats content as json instead of the default type.  This works for directories and files.

**HEAD** is the same as a GET, omitting the body.

**PUT** can be used to write a file.

**DELETE** can be used to delete a file or folder.

**POST** supports two operations, rename and create directory.  

**POST** http://localhost/newDir?create=directory would create a directory named newDir.  

**POST** http://localhost/abc.html?rename=def.html would rename abc.html to def.html.

Run the Example
===============

For further clarification, try running the example.

    npm install crud-file-server

Navigate to the example directory (which should now be under node_modules/crud-file-server/example).

	cd node_modules/crud-file-server/example

Run crud-file-server to host the current directory. 

    crud-file-server -p 3300
    	
Now use your browser to navigate to http://localhost:3300/example.html.  
You will see a simple client that lets you interact with your file system from the web browser.
