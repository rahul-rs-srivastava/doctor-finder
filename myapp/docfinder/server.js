var http = require('http');
var fs = require('fs')
var formidable = require("formidable");
var util = require('util');
var mysql = require("mysql");


var handleRequest = function(request, response) {
  var pathname = request.url;
  var extension = pathname.split('.').pop();

  console.log('Received request for URL: ' + request.url);
  console.log('pathname = '+pathname+', ext = '+ extension);
    
  if(pathname == "/" || extension == "html") {
    if (request.method.toLowerCase() == 'get') {
      displayForm(response);
    } else if (request.method.toLowerCase() == 'post') {
      processAllFieldsOfTheForm(request, response);
    }
  } else if (extension = 'jpg') {
    loadimage(pathname, response);
  }
};


function loadimage(pathname, response) {
  pathname = pathname.substring(1);
  console.log('Reading image from file = ' + pathname);
  fileToLoad = fs.readFileSync(pathname);
  response.writeHead(200, {'Content-Type':  'image/jpg' });
  response.end(fileToLoad, 'binary');
  console.log('[DONE] Reading image from file = ' + pathname);
}


function displayForm(response) {
  console.log('Rendering Search Doctor Form...');
  fs.readFile('SearchDoctor.html', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    response.writeHead(200);
    response.end(data);
    console.log('[Done] Rendering Search Doctor Form.');
  });
}


function processAllFieldsOfTheForm(request, response) {
  var form = new formidable.IncomingForm();
  var htmloutput = '';

  console.log('Generating output html for the given search criteria...');
  form.parse(request, function (err, fields, files) {

    //get user input from request
    console.log('Got User Input...'+ fields.locality + ', ' + fields.speciality);

    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "abcd",
      database: "doctordb"
    });

    //connect to DB
    con.connect(function(err){
      if(err){
        console.log('Error connecting to DB');
        response.writeHead(200, {
            'content-type': 'text/plain'
        });
        response.end("Error connecting to DB as user: root, on host: localhost.");
        return;
      }
      console.log('DB Connection established...');
    });

    //create SQL query
    var sqlquerystr = "SELECT * FROM doctors";

    if (fields.locality != null && fields.locality != '') {
      sqlquerystr += " where loc='"+fields.locality+"'";
    }

    if (fields.speciality != null && fields.speciality != '') {
      if (fields.locality != null && fields.locality != '') {
        sqlquerystr += " and area='"+fields.speciality+"'";
      } else {
        sqlquerystr += " where area='"+fields.speciality+"'";
      }
    }

    //fire the SQL query against DB and process result
    con.query(sqlquerystr, function(err,rows){
      if(err) throw err;

      console.log('Data received from DB:\n');
      console.log(rows);
      console.log('Got rows = ' + rows.length);

      //create html output
      htmloutput = '<html><body>' +
      '<table>' +
          '<tr valign="bottom" style="vertical-align: bottom">' +
              '<td><img src="doc.jpg" height="40" width="60"></td>' +
              '<td style="vertical-align: middle; font-size:40px;">Doctor Finder</td>' +
          '</tr>' +
      '</table>' +
      '<br/>' +
      '<table border="1" cellspacing="0" width="100%">' +
      '<tr> <th>Locality</th> <th>Specialization</th> <th>Doctor Name</th> <th>Description</th> <th>Rating</th> </tr>';

      if (rows.length >0) {
        for (var i = 0; i < rows.length; i++) {
          console.log(rows[i].loc + ', ' + rows[i].area);
          htmloutput += '<tr> <td>'+rows[i].loc+'</td>  <td>'+rows[i].area+'</td>  <td>'+rows[i].doc+'</td>  <td>'+rows[i].qual+'</td> <td>'+rows[i].rating+' <img src="star.jpg" height="15" width="15"></td> </tr>';
        };
      } else {
        console.log('No doctors found with the given search criteria');
      }

      htmloutput += '</table><br/>' +
      '<p style="font-size:15px;">Select doctor to see doctor profile, patient reviews, consultation fees, and book appointment online.</p>' +
      '<br/><a href="SearchDoctor.html">Home</a></body></html>';
      console.log(htmloutput);

      response.writeHead(200, {
            'content-type': 'text/html'
      });
      response.end(htmloutput);
      console.log('[DONE] Rendering html output.');

    });

    con.end(function(err) {
      // The connection is terminated gracefully
      // Ensures all previously enqueued queries are still
      // before sending a COM_QUIT packet to the MySQL server.
    });

  });
}


var www = http.createServer(handleRequest);
www.listen(8080);


