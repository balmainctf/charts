/**
 * Created by Ken.Cui on 2014/4/22.
 */
var express = require('express');
var config=require('./config');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var oneDay = 86400000;

app.use(express.compress());

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());

app.use(express.static(path.join(__dirname, 'public'), {maxAge: oneDay}));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});