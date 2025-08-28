var http = require('http');

http.createServer(function (req, res) {
  res.write("activo.");
  res.end();
}).listen(8000);
