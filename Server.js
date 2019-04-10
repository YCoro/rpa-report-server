var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var sql = require("mssql");

// config for your database
var configDB = {
    user: 'sa',
    password: 'Bdgsa.2018',
    server: '10.1.1.83',
    database: 'rpadb'
};
var reportTable = "bitacora_rpa";
var userTable = "rpa_users";
var verifyUser = "dbo.funcRpaLogin";
var insertUser = "uspRpaAddUser";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.status(200).send("Connected")
});

app.get('/bitacora', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    // create Request object
    var request = new sql.ConnectionPool(configDB).connect().then(pool => {
      return pool.request().query('select * from '+ tableName)
      }).then(result => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json({data: result.recordset, rows: result.rowsAffected[0]});
        sql.close();
      }).catch(err => {
        res.status(500).send({ message: "${err}"})
        sql.close();
      });
});

app.post('/login', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  var request = new sql.ConnectionPool(configDB).connect().then(pool => {
    return pool.request().query('SELECT '+ verifyUser + "('"+email+"','"+password+"')")
    }).then(result => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json({data: result.recordset, rows: result.rowsAffected[0]});
      sql.close();
    }).catch(err => {
      console.log(err)
      res.status(500).send({ message: "${err}"})
      sql.close();
    });
});

app.post('/signup', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;
  let lastName = req.body.lastName;

  var request = new sql.ConnectionPool(configDB).connect().then(pool => {
    return pool.request().query('EXEC '+ insertUser + " "+email+","+password+","+name +","+ lastName)
    }).then(result => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json({data: result.recordset, rows: result.rowsAffected[0]});
      sql.close();
    }).catch(err => {
      res.status(500).send({ message: "${err}"})
      sql.close();
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running.. on port ' + 5000);
});