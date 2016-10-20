var querystring = require("querystring");
    fs = require("fs");
    formidable = require("formidable");

function start(response, request){
  console.log("Request handler 'start' was called.");

  var body ='<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="file" name="upload">'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200,{"Content-Type":"text/html"});
    response.write(body);
    response.end();
}

function upload(response, request){
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();  
    form.uploadDir = "./tmp";//nodejs安装目录与应用目录不在一个盘的时候使用此句处理
   console.log("about to parse");
   form.parse(request,function(error, fields, files){
    console.log("parsing done");
    fs.renameSync(files.upload.path,"./tmp/test.jpg");
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write("received text:<br/>");
    response.write(fields.text+"<br/>");
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}

function show(response, request){
  console.log("Request handler 'show' was called.");
  fs.readFile("./tmp/test.jpg","binary",function(error, file){
    if(error){
      response.writeHead(500,{"Content-Type":"text/plain"});
      response.write(error +"\n");
      response.end();
    }else{
      response.writeHead(200,{"Content-Type":"image/png"});
      response.write(file,"binary");
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;