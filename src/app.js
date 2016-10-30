'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();


app.use(express.static('public'));
// app.get('/', function(req, res) {
//   res.sendfile('./public/index.html');
// });


router.get('/', function(req, res) {
  res.send('im the home page!');  
});

router.get('/about', function(req, res) {
  res.send('im the about page!'); 
});

app.use('/', router);

app.listen(3000);