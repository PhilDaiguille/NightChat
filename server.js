// Chargement des modules
console.log("charged");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Tableau de noms d'utilisateurs anonymes
const anonyme = ["pomme", "banane", "orange", "kiwi", "ananas","carotte", "pomme de terre", "tomate", "poivron", "courgette", "fraise", "citron", "raisin", "mangue", "aubergine", "radis", "brocoli", "patate douce", "chou-fleur", "navet"];

// Variables pour compter les utilisateurs et stocker les utilisateurs connectés
let user = 0;
let connectedUsers = [];

// Route pour la page d'accueil
app.get("/", (req, res) => {
	res.sendFile(__dirname + '/index.html')
});

// Route pour le fichier client.js
app.get("/client.js",(req, res) => {
	res.setHeader('Content-Type', 'text/javascript');
	res.sendFile(__dirname + '/client.js');
});

// Route pour le fichier style.css
app.get("/css/style.css",(req, res) => {
	res.setHeader('Content-Type', 'text/css');
	res.sendFile(__dirname + '/css/style.css');
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
	console.log(`le nombre d'utilisateur est de : ${user}`);
	console.log("a user is connected");
	socket.on('disconnect', () => {
		let index = connectedUsers.indexOf(username);
		connectedUsers.splice(index, 1);
		user--;
		console.log("a user is disconnected");
		console.log(`le nombre d'utilisateur est de : ${user}`);
	});
	
	// Gestion des messages du chat
	socket.on('chat message', msg => {
		let now = new Date(); 
		let hours = now.getHours();
		let minutes = now.getMinutes(); 
		time = `${hours}:${minutes}`;
        console.log(`message reçu : ${msg}`);
        io.emit('chat message', { username: username, message: msg, time : time });
    });
});

// Démarrage du serveur sur le port spécifié ou 3000 par défaut
const port = process.env.PORT || 3000;
http.listen(port, () => {
	console.log("Server running");
});