let choice = io() || io("https://night-chat-seven.vercel.app/");
const socket = choice;
let username = "";

  // Fonction pour ajouter l'utilisateur à la liste des utilisateurs connectés
  function addUserToList() {
    // Vérifie si l'utilisateur est déjà dans la liste
    if (!document.querySelector(`.user p[data-username="${username}"]`)) {
      document.querySelector('.user').innerHTML += `<figure>
        <img src="./assets/discord.png" alt="">
        <figcaption>
            <p data-username="${username}">${username}</p>
        </figcaption>
      </figure>`;
    }
  }

  // Événement de connexion du socket
  socket.on('connect', () => {
    // Envoi des informations de l'utilisateur connecté au serveur
    socket.emit('user connected', username);
    // console.log(connectedUsers);
  });

  // Réception du nombre d'utilisateurs connectés et mise à jour de l'affichage
  socket.on('connected users', count => {
    document.querySelector('.user').textContent = `${count} utilisateur(s) en ligne`;
  });

  // Réception du nom d'utilisateur attribué par le serveur et ajout à la liste des utilisateurs connectés
  socket.on('username', name => {
    username = name;
    addUserToList();
  });

  const input = document.getElementById("message-input");
  const button = document.getElementById("message-send");

  input.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
          send();
      }
  });

  button.addEventListener("click", function(event){
      send();
  });

  const send = () => {
      const text = input.value;
      socket.emit('chat message', text);
      input.value = "";
  };

  // Fonction pour recevoir un message du serveur et l'afficher dans la liste des messages
  const receive = data => {
      const li = document.createElement('li');
      if(data.message != ""){
          li.innerHTML = `<strong>${data.username}</strong> <time>${data.time}</time>: ${data.message}`;
          document.getElementById("messages").appendChild(li);
      }
  };

  // Réception du nom d'utilisateur attribué par le serveur et mise à jour de l'affichage de l'utilisateur courant
  socket.on('username', name => {
      username = name;
      document.querySelector('.utilisateur').innerHTML = `<figure>
              <img src="./assets/discord.png" alt="">
              <figcaption>
                  <p>${username}</p>
              </figcaption>
          </figure>`;
  });

  // Réception d'un message du serveur et appel de la fonction receive pour afficher le message reçu
  socket.on('chat message', receive);
