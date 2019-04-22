var express = require('express');
var bodyParser = require('body-parser')
const config = require('config');
var sql = require("mssql");
var app = express();


const dbConfig = config.get('Report.configDB');
const dbTables = config.get('Report.configTables');
const port = config.get('Port.portNumber');

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
    // create Request object
    var request = new sql.ConnectionPool(dbConfig).connect().then(pool => {
      return pool.request().query('select * from '+ dbTables.report)
      }).then(result => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json({data: result.recordset, rows: result.rowsAffected[0]});
        sql.close();
      }).catch(err => {
        res.status(500).send({ message: err})
        sql.close();
      });
});

app.post('/login', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  var request = new sql.ConnectionPool(dbConfig).connect().then(pool => {
    return pool.request().query('SELECT '+ dbTables.verifyUserFunction + "('"+email+"','"+password+"')")
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

  var request = new sql.ConnectionPool(dbConfig).connect().then(pool => {
    return pool.request().query('EXEC '+ dbTables.addUser + " "+email+","+password+","+name +","+ lastName)
    }).then(result => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(200).json({data: result.recordset, rows: result.rowsAffected[0]});
      sql.close();
    }).catch(err => {
      res.status(500).send({ message: "${err}"})
      sql.close();
    });
});

var server = app.listen(port, function () {
    console.log('Server is running.. on port ' + port);
});
