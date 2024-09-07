const socket = io();


const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".containers")

const append = (message,position)=>{
     const createElement = document.createElement("div");
     createElement.innerText = message;
     createElement.classList.add("message");
     createElement.classList.add(position);
     messageContainer.append(createElement);
};

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`you: ${message}`,"right");
    socket.emit("send", message);
    messageInput.value = ''
})

let name ;
do {
    name =   prompt("please Enter your name")
  } while (!name);
  
socket.emit("new-user-joined",name)

socket.on("user-joined",name =>{
    append(`${name}: join the chat `,"right")
});

socket.on("receive", data =>{
    console.log(data)
    append(`${data.name}: ${data.message} `,"left")
})