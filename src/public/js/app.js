const socket = io();

// const welcome = document.getElementById("welcome");
// const form = document.querySelector("form");
// const room = document.getElementById("room");
//
// room.hidden = true;
//
// let roomName;
//
// function addMessage(message) {
//     const ul = room.querySelector("ul")
//     const li =document.createElement("li");
//     li.innerText = message;
//     ul.appendChild(li);
// }
//
// function showRoom(){
//     welcome.hidden = true;
//     room.hidden = false;
//     const h3 = room.querySelector("h3");
//     h3.innerText = `Room ${roomName}`;
//     const msgForm = room.querySelector("#msg");
//     const nameForm = room.querySelector("#name");
//     msgForm.addEventListener("submit", handleMessageSubmit);
//     nameForm.addEventListener("submit", handleNicknameSubmit);
// }
//
// function backendDone(msg) {
//     console.log("The backend says: ",msg);
// }
//
// function handleMessageSubmit(event) {
//     event.preventDefault();
//     const input = room.querySelector("#msg input");
//     const value = input.value;
//     socket.emit("new_message", input.value,roomName, () => {
//         addMessage(`You: ${value}`);
//     });
//     input.value = "";
// }
//
// function handleNicknameSubmit(event) {
//     event.preventDefault();
//     const input = room.querySelector("#name input");
//     const value = input.value;
//     socket.emit("nickname", input.value);
//     input.value = "";
// }
//
//
// function handleRoomSubmit(event) {
//     event.preventDefault();
//     const input = form.querySelector("input");
//     socket.emit("enter_room", input.value , showRoom); // 오브젝트 전송 가능
//     roomName = input.value;
//     input.value = "";
// }
//
// form.addEventListener("submit", handleRoomSubmit);
//
//
//
// socket.on("welcome",(user,newCount) => {
//     const h3 =room.querySelector("h3");
//     h3.innerText = `Room ${roomName} (${newCount})`;
//     addMessage(`${user} arrived!`);
// });
//
// socket.on(("bye"), (left,newCount)=>{
//     const h3 =room.querySelector("h3");
//     h3.innerText = `Room ${roomName} (${newCount})`;
//    addMessage(`${left} left`);
// });
//
// socket.on(("new_message"), addMessage);
//
// socket.on(("room_change"), (rooms) => {
//     const roomList = welcome.querySelector("ul");
//     roomList.innerHTML = "";
//
//     if(rooms.length === 0){
//         return;
//     }
//     rooms.forEach(room => {
//         const li = document.createElement("li");
//         li.innerText=room;
//         roomList.append(li);
//     });
// });


//이 아래로 webSocket으로 구현한 채팅 아래는 socket.io 활용
// const messageList =document.querySelector('ul');
// const messageForm = document.querySelector("#message");
// const nickForm = document.querySelector("#nick");
// const socket = new WebSocket(`ws://${window.location.host}`);
//
//
// function makeMessage(type, payload){
//     const msg = {type, payload};
//     return JSON.stringify(msg);
// }
//
// socket.addEventListener("open", () =>{
//     console.log("connected to Server ✅");
// });
//
// socket.addEventListener("message", (message) =>{
//     const li = document.createElement("li");
//     li.innerText = message.data.toString();
//     messageList.append(li);
//
// });
//
// socket.addEventListener("close", () => {
//     console.log("DisConnected from Server ❌");
// });
//
// // setTimeout(() => {
// //     socket.send("hello from the browser! ")
// // }, 10000);
// function handleSubmit(event) { // 출력
//     event.preventDefault();
//     const input = messageForm.querySelector("input");
//     socket.send(makeMessage("new_message", input.value));
//     const li = document.createElement("li");
//     li.innerText = `You: ${input.value}`;
//     messageList.append(li);
//     input.value = "";
// }
//
// function handleNickSubmit(event) {
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname", input.value));
//     input.value = "";
// }
//
// messageForm.addEventListener("submit", handleSubmit);
// nickForm.addEventListener("submit", handleNickSubmit);
//


