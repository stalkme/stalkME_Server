
var mysql = require('mysql');
var http = require('http');

var con = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "stalkme_db"
  }
);

con.connect(function(err){
  if(err) throw err;
  console.log("Connected");
  var sql = "CREATE TABLE IF NOT EXISTS coordinates (ID int NOT NULL PRIMARY KEY,Xcoordinate int,Ycoordinate int,Text varchar(50))";
  con.query(sql, function(err,result){
    if(err) throw err;
  });

  http.createServer(function (request, response)
{
  var sql="SELECT ID, Text FROM coordinates WHERE ID = ?";
  con.query(sql, [4], function(err, result,fields)
  {
    response.writeHead(200, { 'Content-type' : 'application/json'});
    response.write(JSON.stringify(result));
    response.end();
})
}).listen(8084);
});


/*
var http = require('http');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'stalkme_db'
});

console.log('MySQL Connection details  '+connection);

http.createServer(function (request, response)
{
        console.log('Creating the http server');
        connection.query('SELECT ID, Text FROM coordinates WHERE ID = ?',[4], function(err, rows, fields)
        {
                console.log('Connection result error '+err);
                console.log('no of records is '+rows.length);
                response.writeHead(200, { 'Content-Type': 'application/json'});
                response.end(JSON.stringify(rows));
                response.end();
        });

}).listen(8084);
*/
  /*
  var sql1 = "INSERT INTO coordinates (ID, Xcoordinate, Ycoordinate, Text) VALUES (4,23,42, 'kielbasa')";
  con.query(sql1, function(err,result){
    if(err) throw err;
    console.log(result.insertId);
  });
  */
