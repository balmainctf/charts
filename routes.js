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
        var url = config.host + 'stationEventInfo?key=' + config.station_key + '&sdt=' + sdate + '&edt=' + edate;
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

        var url = config.host + 'stationCO2AvoidedInfo?key=' + config.station_key + '&period=' + period + '&date=' + date;
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
        var url = config.host + 'stationYieldInfo?key=' + config.station_key + '&period=' + period + '&date=' + date;
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
        var url = config.host + 'stationPowerInfo?key=' + config.station_key + '&period=' + period + '&date=' + date;
        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    })

    app.get('/', function (req, res, next) {

        var url = config.host + 'stationDynamicInfo?key=' + config.station_key;

        urllib.request(url, {dataType: 'json'}, function (err, data) {
            if (err) {
                return next(err);
            }
            var dynamicInfo = data;
            res.render('home', {
                    title: 'home',
                    "e_total": dynamicInfo['E-Total'].value + ' ' + dynamicInfo['E-Total'].unit,
                    "e_today": dynamicInfo['E-Today'].value + ' ' + dynamicInfo['E-Today'].unit,
                    "total_yield": dynamicInfo['TotalYield'].value + ' ' + dynamicInfo['TotalYield'].unit,
                    "e_month": dynamicInfo['E-Month'].value + ' ' + dynamicInfo['E-Month'].unit,
                    "co2Avoided": dynamicInfo['CO2Avoided'].value + ' ' + dynamicInfo['CO2Avoided'].unit,
                    "ludt": dynamicInfo.ludt
                }
            );
        });

    });
}
