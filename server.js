
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Tableau de noms d'utilisateurs anonymes
const anonyme = ["pomme", "banane", "orange", "kiwi", "ananas", "carotte", "pomme de terre", "tomate", "poivron", "courgette", "fraise", "citron", "raisin", "mangue", "aubergine", "radis", "brocoli", "patate douce", "chou-fleur", "navet"];

// Variables pour compter les utilisateurs et stocker les utilisateurs connectés
let user = 0;
let connectedUsers = [];

app.get(["/", "/client.js", "/css/style.css", "/server.js", "/socket.io/socket.io.js"], (req, res) => {
	if (req.url === "/") {
		res.sendFile(__dirname + '/index.html');
	} else if (req.url === "/client.js") {
		res.setHeader('Content-Type', 'text/javascript');
		res.sendFile(__dirname + '/client.js');
	}
	else if (req.url === "/server.js") {
		res.setHeader('Content-Type', 'text/javascript');
		res.sendFile(__dirname + '/server.js');
	}
	else if (req.url === "/socket.io/socket.io.js") {
		res.setHeader('Content-Type', 'text/javascript');
		res.sendFile(__dirname + '/socket.io/socket.io.js');
	} else if (req.url === "/css/style.css") {
		res.setHeader('Content-Type', 'text/css');
		res.sendFile(__dirname + '/css/style.css');
	}
});

// Gestion des connexions et déconnexions des utilisateurs
io.on('connection', socket => {
	user++;
	let username = anonyme[Math.floor(Math.random() * anonyme.length)] + "#" + user;
	let now = new Date();
	let hours = now.getHours();
	let minutes = now.getMinutes();
	connectedUsers.push(username);
	io.emit('user connected', connectedUsers)
	time = `${hours}:${minutes}`;
	socket.emit('username', username);
	socket.emit('time', time);
	console.log(`un utilisateur est connecté , le nombre d'utilisateur est de : ${user}`);
	socket.on('disconnect', () => {
		// let index = connectedUsers.indexOf(username);
		// connectedUsers.splice(index, 1);
		user--;
		console.log(`un utilisateur est déconnecté, le nombre d'utilisateur est de : ${user}`);
	});

	// Gestion des messages du chat
	socket.on('chat message', msg => {
		let now = new Date();
		let hours = now.getHours();
		let minutes = now.getMinutes();
		time = `${hours}:${minutes}`;
		console.log(`Le message reçu : "${msg}" de : ${username}`);

		io.emit('chat message', { username: username, message: msg, time: time });
	});
});

// Démarrage du serveur sur le port spécifié ou 3000 par défaut
const port = process.env.PORT || 3000;
http.listen(port, () => {
	if (port == 3000) {
		console.log(`Server running http://localhost:${port}`);
	}
	else {
		console.log(`Server running http://${port}`);
	}
});
