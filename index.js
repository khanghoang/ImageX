var gm = require('graphicsmagick-stream')
var fs = require('fs')
var express = require('express');
var http = require('http');
var https = require('https');
var app = express();
 
var convert = gm({
  pool: 5,             // how many graphicsmagick processes to use 
  format: 'png',       // format to convert to 
  scale: {
    width: 200,        // scale input to this width 
    height: 200,       // scale input this height 
    type: 'contain'    // scale type (either contain/cover/fixed) 
  },
  crop: {
    width: 200,        // crop input to this width 
    height: 200,       // crop input this height 
    x: 0,              // crop using this x offset 
    y: 0               // crop using this y offset 
  },
  page: [1,5],         // only render page 1 to 5 (for pdfs) 
                       // set to a single number if you only want to render one page 
                       // or omit if you want all pages 
  rotate: 'auto',      // auto rotate image based on exif data 
                       // or use rotate:degrees 
  density: 300,        // set the image density. useful when converting pdf to images 
  split: false,        // when converting pdfs into images it is possible to split 
                       // into multiple pages. If set to true the resulting file will 
                       // be a tar containing all the images. 
  tar: false           // stream a tar containing the image. This is forced to `true` 
                       // if split is set to `true` 
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/api/image', function(req, res) {
    var url = req.query.url;
    var request;
    if(url) {
      if(!!~url.toLowerCase().indexOf("https://")) {
        request = https.get(url, function(response) {
          response.pipe(convert())
		.pipe(convert({scale:300, rotate:180, format:'png'}))
		.pipe(res)
        });
      } else if (!!~url.toLowerCase().indexOf("http://")) {
        request = http.get(url, function(response) {
          response.pipe(convert())
		.pipe(convert({scale:300, rotate:180, format:'png'}))
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
