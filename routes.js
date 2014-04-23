
module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index', {});
    });

    app.get('/stationDy', function (req, res) {
        res.render('pie-stationDy');
    });
    app.get('/7day', function (req, res) {
        res.render('7day');
    });
}
