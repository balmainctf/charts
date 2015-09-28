/**
 * Created by Ken.Cui on 2014/4/22.
 */
var express = require('express');
var config = require('./config');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

var app = express();
var oneDay = 86400000;

app.use(express.compress());

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.logger({stream: accessLog}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'echart',
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
}));

app.use(app.router);

app.use(express.static(path.join(__dirname, 'public'), {maxAge: oneDay}));


app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.use(function (req, res, next) {
    var domain = require('domain').create();
    domain.on('error', function (err) {
        console.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            //5���ڽ��й��ϱ����Թػ�
            setTimeout(function () {
                console.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);

            //�Ӽ�Ⱥ�жϿ�
            var worker = require('cluster').worker;
            if (worker) worker.disconnect();
            server.close();

            try {
                //����ʹ��Express����·��
                next(err);
            } catch (error) {
                console.error('Express error mechanism failed.\n', error.stack);
                res.statusCode(500);
                res.setHeader('content-type', 'text-plain');
                res.end('Server error.');
            }
        } catch (error) {
            console.error('Unable to send 500 response.\n', error.stack);
        }
    });

    domain.add(req);
    domain.add(res);

    domain.run(next);
});

routes(app);

var server;
function startServer() {
    server = http.createServer(app).listen(app.get('port'), function () {
        console.log('Express started in ' + app.get('env') + ' mode on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
    });
}

if (require.main === module) {
    //Ӧ�ó���ֱ�����У�����Ӧ�÷�����
    startServer();
} else {
    //Ӧ�ó�����Ϊһ��ģ�����룻��������
    module.exports = startServer;
}
