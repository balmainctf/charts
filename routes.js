var dynamicInfo = require('./data/stationDynamicInfo.json');
var yieldInfo = require('./data/stationYieldInfo.json');
var powerInfoByDay = require('./data/powerInfoByDay.json');

module.exports = function (app) {

    app.get('/e_power', function (req, res) {
        res.render('e_power', {title: "Energy & Power"});
    });

    app.get('/yield', function (req, res) {
        res.render('yield', {title: "Yield"});
    });
    app.get('/co2Avoided', function (req, res) {
        res.render('co2Avoided', {title: "CO2 Avoided"});
    });

    app.get('/stationYieldInfo', function (req, res) {
        res.json(yieldInfo);
    });

    app.get('/dynamicInfo', function (req, res) {
        res.json(dynamicInfo);
    });

    app.get('/powerInfo/byday', function (req, res) {
        res.json(powerInfoByDay);
    })

    app.get('/', function (req, res) {

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
}
