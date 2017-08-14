var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mysql = require('mysql');

var con = mysql.createConnection({
  port: 3306,
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "gatetracker"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/' , function(req ,res){
	res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
	console.log('socket start');
	socket.on('chatmessage' ,function(data){
		console.log(data);
		io.emit('chatmessage',data);
	});
	socket.on('getcountjob',function(type){
		var cnt = 0;
		var query = con.query("select count(*) as cnt from notification where status=0 and type="+type , function(err,res,field){
			for (var index in res)
        	{
           	 	cnt = res[index].cnt;
        	}
        	io.emit('getcountjob',cnt);
		});
	});
})

http.listen(3000, function(){
	console.log('on 3000');
});
