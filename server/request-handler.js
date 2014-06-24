/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var count = 0;

var storage = [];


var requestHandler = {};

requestHandler.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  var body = {
    results: []
  };
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;
  // console.log("HEADER", request.headers);
  console.log("URL", request.url);
  if (request.method === 'POST') {
    statusCode = 201;
    request.on('data', function(data) {
      data = JSON.parse(data);
      storage.push(createMessage(data));
    });
  } else if (request.method === 'GET') {
    if (request.url === '/arglebargle') {
      statusCode = 404;
    }


    //Examine URL for Query
    var filter = examineURL(request.url);
    console.log("FILTER", filter);

    for (var i = 0; i < storage.length; i++) {
      var valid = true;
      for (var key in filter) {
        if (filter[key] !== storage[i][key]) {
          valid = false;
          break;
        }
      }
      if (valid) {
        body.results.push(storage[i]);
      }
    }
  }
  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */

  var headers = defaultCorsHeaders;

  // headers['Content-Type'] = "text/plain";
  headers['Content-Type'] = "application/json";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/

  response.end(JSON.stringify(body));
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

function createMessage(data) {
  count++;
  return {
    'username': data.username,
    'objectId': count,
    'message': data.text,
    'createdAt': new Date(),
    'updatedAt': new Date(),
    'roomname': data.roomname
  };
}

module.exports = requestHandler;

function examineURL(url) {
  var obj;
  url = decodeURIComponent(url);
  console.log("URL in EXAMINE", url);
  if (url[url.length - 1] === '}') {
    obj = JSON.parse(url.substring(url.lastIndexOf('{')));
  }
  console.log("OBJECT", obj)
  return obj;
}


