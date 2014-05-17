var app = require('http').createServer(handler),
	fs = require('fs');

app.listen(80);


function handler (req, res) {
	fs.readFile(__dirname + req['url'],
	function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('<h3>Error loading ' + __dirname + req['url'] + '</h3>');
		}

		res.writeHead(200);
		res.end(data);
	});
}