
const messageList =document.querySelector('ul');
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`);


function makeMessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}

socket.addEventListener("open", () =>{
    console.log("connected to Server ✅");
});

socket.addEventListener("message", (message) =>{
    const li = document.createElement("li");
    li.innerText = message.data.toString();
    messageList.append(li);

});

socket.addEventListener("close", () => {
    console.log("DisConnected from Server ❌");
});

// setTimeout(() => {
//     socket.send("hello from the browser! ")
// }, 10000);
function handleSubmit(event) { // 출력
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);