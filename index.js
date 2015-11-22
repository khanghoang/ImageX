var gm = require('graphicsmagick-stream')
var fs = require('fs')
var express = require('express');
var http = require('http');
var https = require('https');
var app = express();
 
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/api/image', function(req, res) {
    var url = req.query.url;
    var request;
    var resize = gm({
  	pool: 20,             // how many graphicsmagick processes to use 
  	format: 'png',       // format to convert to 
	scale: {
	width: req.query.w || 100,
	height: req.query.h || 100,
    	type: 'contain'    // scale type (either contain/cover/fixed) 
	}})

    if(url) {
      if(!!~url.toLowerCase().indexOf("https://")) {
        request = https.get(url, function(response) {
          response.pipe(resize())
		.pipe(res)
        });
      } else if (!!~url.toLowerCase().indexOf("http://")) {
        request = http.get(url, function(response) {
          response.pipe(resize())
		.pipe(res)
        });
      } else {
        return res.status(403).send({message: "URL is not valid"});
      }
    } else {
      return res.status(403).send({message: "URL is not valid"});
    }

  })

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
