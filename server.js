console.log("charged");
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

const anonyme = ["pomme", "banane", "orange", "kiwi", "ananas","carotte", "pomme de terre", "tomate", "poivron", "courgette", "fraise", "citron", "raisin", "mangue", "aubergine", "radis", "brocoli", "patate douce", "chou-fleur", "navet"];
let user = 0;
let connectedUsers = [];
app.get("/", function (req, res) {
	res.sendFile(__dirname + '/index.html')

})
app.get("/client.js", function (req, res) {
	res.setHeader('Content-Type', 'text/javascript');
	res.sendFile(__dirname + '/client.js');
  });
  
app.get("/css/style.css", function (req, res) {
	res.setHeader('Content-Type', 'text/css');
	res.sendFile(__dirname + '/css/style.css');
});

io.on('connection', function(socket){
	user++;
	let username = anonyme[Math.floor(Math.random() * anonyme.length)] + "#" + user;
	let now = new Date(); 
	let hours = now.getHours();
	let minutes = now.getMinutes(); 
	connectedUsers.push(username);
	io.emit('user connected', connectedUsers)
	time = + hours + ":" + minutes;
	socket.emit('username', username);
	socket.emit('time', time);
	console.log("le nombre d'utilisateur est de :" + user)
	console.log("a user is connected"),
	socket.on('disconnect', function(){
		let index = connectedUsers.indexOf(username);
		connectedUsers.splice(index, 1);
		console.log("a user is disconnected")
		console.log("le nombre d'utilisateur est de :" + user)
	}),
	socket.on('chat message', function(msg){
		let now = new Date(); 
		let hours = now.getHours();
		let minutes = now.getMinutes(); 
		time = + hours + ":" + minutes;
        console.log("message reçu : " + msg)
        io.emit('chat message', { username: username, message: msg, time : time });
    })
})
const port = process.env.PORT || 3000
http.listen(port, function () {
	console.log("Server running")
})