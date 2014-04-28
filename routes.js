var dynamicInfo = require('./data/stationDynamicInfo.json');
var yieldInfo = require('./data/stationYieldInfo.json');

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

    app.get('/', function (req, res) {
        res.render('home', {title: 'home'});
    });
}
