var urllib = require('urllib');
var config = require('./config');
var util = require('./libs/util');

module.exports = function (app) {

    app.get('/plant/:sid/e_power/:period', function (req, res) {
        var period = req.params.period;
        var sid = req.params.sid;
        var date = util.format_date(new Date(), period);

        res.render('e_power', {
            title: "Energy & Power",
            period: period,
            sid: sid,
            format: date.format,
            currDate: date.value
        })
    });

    app.get('/:sid/power/:period/:date', function (req, res, next) {
        var period = req.params.period;
        var date = req.params.date;
        var sid = req.params.sid;

        var url = config.host + 'power?sid=' + sid + '&period=' + period + '&date=' + date;
        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    });

    app.get('/list', function (req, res) {

        res.render('home', {title: 'Station Dynamic Info'});
//        res.redirect('/e_power/bydays');
    });

    app.get('/', function (req, res) {
        res.render('index', {title: 'Zevercloud - Index'})
    });
    app.get('/data/total', function (req, res, next) {
        var url = config.host + 'totalview';
        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    });

    app.get('/login', function (req, res) {
        res.render('login');
    });

    app.post('/login', function (req, res, next) {
        //req.session.user = "116";
        //req.flash('success', 'µÇÂ¼³É¹¦!');
        var url = config.host + "login";
        var account = req.body.account;
        var pwd = req.body.pwd;
        urllib.request(url, {
            method: 'POST',
            dataType: 'text',
            data: {'account': account, 'pwd': pwd}
        }, function (err, data) {
            if (err) {
                return next(err)
            }
            if (data === 'false') {
                res.redirect('/login');
            } else {
                var user = JSON.parse(data);
                res.redirect('/plant?userId=' + user.userId);
            }

        });
    });

    //app.get('/plant', checkLogin);
    app.get('/plant', function (req, res, next) {
        var url = config.host + 'plant?userid=' + req.query.userId;
        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.render('plant', {plants: data});
        });

    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            //req.flash('error', 'Î´µÇÂ¼');
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            //req.flash('error', 'ÒÑµÇÂ¼');
            res.redirect('back');
        }
        next();
    }
}
