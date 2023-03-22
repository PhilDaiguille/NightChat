let socket = io();
let username = "";

// Ajoute l'utilisateur à la liste
function addUserToList() {
  // Vérifie si l'utilisateur est déjà dans la liste
  if (!document.querySelector(`.user p[data-username="${username}"]`)) {
    document.querySelector('.user').innerHTML += `<figure>
      <img src="https://support.discord.com/hc/user_images/l12c7vKVRCd-XLIdDkLUDg.png" alt="">
      <figcaption>
          <p data-username="${username}">${username}</p>
      </figcaption>
    </figure>`
  }
}

socket.on('connect', function() {
  socket.emit('user connected', username);
  socket.emit('user connected', connectedUsers);
  console.log(connectedUsers)
});
socket.on('connected users', function(count) {
  document.querySelector('.user').textContent = `${count} utilisateur(s) en ligne`;
});
socket.on('username', function(name) {
  username = name;
  addUserToList();
});

let send = function () {
    let text = document.getElementById("message-input").value;
    socket.emit('chat message', text);
};

let receive = function (data) {
    let li = document.createElement('li');
    if(data.message != ""){
        li.innerHTML = "<strong>" + data.username + "</strong>" +  ` <time> ${data.time} </time>: ` + data.message;
        document.getElementById("messages").appendChild(li);
    }
};
socket.on('username', function(name) {
    username = name;
    document.querySelector('.utilisateur').innerHTML = `<figure>
            <img src="https://support.discord.com/hc/user_images/l12c7vKVRCd-XLIdDkLUDg.png" alt="">
            <figcaption>
                <p>${username}</p>
            </figcaption>
        </figure>`
});
socket.on('chat message', receive);

