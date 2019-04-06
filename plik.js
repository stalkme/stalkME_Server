
var mysql = require('mysql');
var http = require('http');
var querystring = require('querystring');
var url = require('url');

var con = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "stalkme_db"
  }
);

function processPost(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function') return null;

    if(request.method == 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}


con.connect(function(err){
  if(err) throw err;
  console.log("Connected");
  var sql = "CREATE TABLE IF NOT EXISTS coordinates (ID int NOT NULL PRIMARY KEY,Xcoordinate int,Ycoordinate int,Text varchar(50))";
  con.query(sql, function(err,result){
    if(err) throw err;
  });


  http.createServer(function (request, response)
{
  if(request.method == 'GET'){
    var q = url.parse(request.url,true).query;
    var sql="SELECT ID, Text FROM coordinates WHERE (Xcoordinate-?)*(Xcoordinate-?) * (Ycoordinate-?) * (Ycoordinate-?) > 10";
    var sql1 = "INSERT INTO coordinates (ID, Xcoordinate, Ycoordinate, Text) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE Xcoordinate= ? , Ycoordinate= ? , Text= ?" ;
    con.query(sql1,[q.ID,q.Xcoordinate,q.Ycoordinate,q.Text,q.Xcoordinate,q.Ycoordinate,q.Text], function(err,result){
      if(err) throw err;
    });

    //console.log(q.ID);
    con.query(sql, [q.Xcoordinate,q.Xcoordinate,q.Ycoordinate,q.Ycoordinate], function(err, result)
    {
      if (err) throw err;
      response.writeHead(200, { 'Content-type' : 'application/json'});
      response.write(JSON.stringify(result));
      response.end();
  });
  }
    /*request.on('data',fuction(data)
  {

  });*/
  else if(request.method == 'POST') {
      processPost(request, response, function() {
          console.log(request.post);
          console.log(request.post.ID);
          // Use request.post here
          var sql="SELECT ID, Text FROM coordinates WHERE (Xcoordinate-?)*(Xcoordinate-?) * (Ycoordinate-?) * (Ycoordinate-?) > 10";
          /*ar sql1 = "INSERT INTO coordinates (ID, Xcoordinate, Ycoordinate, Text) VALUES (?,?,?,?)";
          con.query(sql1,[q.ID,q.Xcoordinate,q.Ycoordinate,q.Text], function(err,result){
            if(err) throw err;
          });
          */
          //console.log(q.ID);
          con.query(sql, [q.Xcoordinate,q.Xcoordinate,q.Ycoordinate,q.Ycoordinate], function(err, result)
          {
            if (err) throw err;
            response.writeHead(200, { 'Content-type' : 'application/json'});
            response.write(JSON.stringify(result));
            response.end();
        });
        /*
          var sql="SELECT ID, Text FROM coordinates WHERE ID = ?";
          con.query(sql, [request.post.ID], function(err, result,fields)
          {
            if (err) throw err;
            response.writeHead(200, { 'Content-type' : 'application/json'});
            response.write(JSON.stringify(result));
            response.end();
        });
        */
          /*response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
          response.end();*/
      });
  }
  else {
      response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
      response.write("Przykladowy 222 tekst");
      response.end();
  }
  //var question1 = request.json.stringify();

}).listen(8085);
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
