
module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index', {});
    });

    app.get('/pie', function (req, res) {
        res.render('pie');
    });
    app.get('/line', function (req, res) {
        res.render('line');
    });
    app.get('/line-time',function(req,res){
       res.render('line-time');
    });
}
