// 引入编写好的api
var api = require('./api'); 
// 引入文件模块
var fs = require('fs');
// 引入处理路径的模块
var path = require('path');
// 引入处理post数据的模块
var bodyParser = require('body-parser')
// 引入Express
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(api);
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/api/setup', function (req, res) {
  new db.User(req.body)
    .save()
    .then(() => {
      res.status(200).end()
      db.initialized = true
    })
    .catch(() => res.status(500).end())
})

app.get('/', function(request, response) {
  response.render('index');
});

//~ app.listen(app.get('port'), function() {
  //~ console.log('Node app is running on port', app.get('port'));
//~ });
app.listen(app.get('port'), function () {
  console.log('Visit http://localhost:' + app.get('port'))
})
console.log('success listen'+app.get('port')+'…………');
