var urllib = require('urllib');
var config = require('./config');
var util = require('./libs/util');

module.exports = function (app) {

    app.get('/plant/:sid/e_power/:period',checkLogin);
    app.get('/plant/:sid/e_power/:period', function (req, res) {
        var period = req.params.period;
        var sid = req.params.sid;
        var plantName = 'Demo Plant';
        var date = util.format_date(new Date(), period);

        if (req.session.plant) {
            var plant = req.session.plant;
            for (var i = 0; i < plant.length; i++) {
                var id = plant[i].id;
                if (sid === id) {
                    plantName = plant[i].name;
                    break;
                }
            }
        }
        res.render('e_power', {
            title: "Overview",
            period: period,
            sid: sid,
            uid:req.session.user.userId,
            format: date.format,
            plantName: plantName,
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

    app.get('/', function (req, res) {
        res.render('index', {title: 'Zevercloud - Home'})
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

    app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'µÇÂ¼',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });

    app.post('/login', checkNotLogin);
    app.post('/login', function (req, res, next) {

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
                req.session.user = user;
                res.redirect('/plant?userId=' + user.userId);
            }

        });
    });

    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.session.plant = null;
        req.flash('success', 'µÇ³ö³É¹¦!');
        res.redirect('/');
    });

    app.get('/plant', checkLogin);
    app.get('/plant', function (req, res, next) {
        var url = config.host + 'plant?userid=' + req.query.userId;
        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            req.session.plant = data;
            res.render('plant', {plants: data});
        });

    });

    app.use(function (req, res) {
        res.render("404");
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', 'Î´µÇÂ¼');
            res.redirect('/login');
        } else {
            next();
        }
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', 'ÒÑµÇÂ¼');
            res.redirect('/plant?userId=' + req.session.user.userId);
        } else {
            next();
        }
    }
}
