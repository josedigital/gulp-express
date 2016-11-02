'use strict';

// simple express server
var express = require('express');
var routes = require('./routes/index');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static('public'));
app.use('/css', express.static('public/css'));

app.use('/', routes);


// app.use('/', router);

app.listen(3000);