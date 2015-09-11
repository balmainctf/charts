var urllib = require('urllib');
var config = require('./config');
var util = require('./libs/util');

module.exports = function (app) {

    app.get('/e_power/:period', function (req, res) {
        var period = req.params.period;
        var date = util.format_date(new Date(), period);

        res.render('e_power', {title: "Energy & Power", period: period, format: date.format, currDate: date.value})
    });

    app.get('/yield/:period', function (req, res) {
        var period = req.params.period;
        var date = util.format_date(new Date(), period);

        res.render('yield', {title: "Yield", period: period, format: date.format, currDate: date.value});
    });
    app.get('/co2Avoided/:period', function (req, res) {
        var period = req.params.period;
        var date = util.format_date(new Date(), period);

        res.render('co2Avoided', {title: "CO2 Avoided", period: period, format: date.format, currDate: date.value});
    });

    app.get('/station_env', function (req, res) {

        res.render('station_env', {title: 'Station Event'});
    });

    app.get('/station_evn_info', function (req, res, next) {
        var sdate = req.query.sdate;
        var edate = req.query.edate;
        if (sdate === '' && edate === '') {
            sdate = edate = util.format_date(new Date(), 'bydays').value;
        } else if (sdate === '' || sdate > edate) {
            sdate = edate;
        }
        var url = config.host + 'getPlantEvent?key=' + config.station_key + '&sdt=' + sdate + '&edt=' + edate;
        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    });

    app.get('/co2AvoidedInfo/:period/:date', function (req, res, next) {
        var period = req.params.period;
        var date = req.params.date;

        var url = config.host + 'getPlantCO2Avoided?key=' + config.station_key + '&period=' + period + '&date=' + date;
        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    });

    app.get('/stationYieldInfo/:period/:date', function (req, res, next) {
        var period = req.params.period;
        var date = req.params.date;
        var url = config.host + 'getPlantYield?key=' + config.station_key + '&period=' + period + '&date=' + date;
        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    });

    app.get('/powerInfo/:period/:date', function (req, res, next) {
        var period = req.params.period;
        var date = req.params.date;
        var url = config.host + 'getPlantOutput?key=' + config.station_key + '&period=' + period + '&date=' + date;
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

    app.post('/login', function (req, res) {
        res.redirect('/plant?userId=116');
    });

    app.get('/plant', function (req, res, next) {
        var url = config.host + 'plant?userid=' + req.query.userId;
        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.render('plant', {plants: data});
        });

    });

    app.get('/stationDyInfo', function (req, res, next) {
        var url = config.host + 'getPlantOverview?key=' + config.station_key;
        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    });
}
