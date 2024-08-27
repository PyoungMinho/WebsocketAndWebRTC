
const socket = io();

const myFace = document.getElementById('myFace');
const muteBtn    = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect  = document.getElementById("cameras");
const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName ;
let myPeerConnection;
let myDataChannel;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId ;
            option.innerText = camera.label;
            if(currentCamera.label === camera.label) {
                option.selected = true;
            }
            cameraSelect.appendChild(option);
        })
    } catch (e) {
        console.log(e);
    }
}


async function getMedia(deviceId){
    const initialConstrains = {
        audio: true,
        video: { facingMode: "user" },
    };
    const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } },
    };

    try {
        myStream =  await navigator.mediaDevices.getUserMedia(
            deviceId? cameraConstraints : initialConstrains
        );
        // {audio: true , video: {facingMode: "user"}} // 셀프캠
        // {audio: true , video: {facingMode: "enviroment"}} // 후방캠
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }
    }catch (e){
        console.log(e);
    }
}

getMedia();

function handleMuteClick(){
    myStream.getAudioTracks().forEach((track) =>  (track.enabled = !track.enabled));
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    }else{
        muteBtn.innerText = "Mute";
        muted= false;
    }
}

function handleCameraClick() {
    myStream.getVideoTracks().forEach((track) =>  (track.enabled = !track.enabled));
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await getMedia(cameraSelect.value);
    if (myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection
            .getSenders()
            .find((sender) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
    }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);

const welcomeForm = document.querySelector("form");
const welcome = document.getElementById("welcome");
async function initCall(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}


async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = document.querySelector("input");
    await initCall();
    socket.emit("join_room",input.value);
    roomName = input.value;
    input.value ="";

}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);



//socket code

socket.on("welcome", async () => {
    myDataChannel = myPeerConnection.createDataChannel("chat");
    myDataChannel.addEventListener("message", (event) => console.log(event.data));
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("signalingState welcome : ", myPeerConnection.signalingState);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
    // Peer A
})

socket.on("offer", async (offer) => {
    myPeerConnection.addEventListener("datachannel", (event) => {
        myDataChannel = event.channel;
        myDataChannel.addEventListener("message", (event) =>
            console.log(event.data)
        );
    });
    console.log("signalingState offer : ", myPeerConnection.signalingState);
    console.log("received the offer");
    myPeerConnection.setRemoteDescription(offer);
   const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
   socket.emit("answer", answer,roomName);
    console.log("signalingState emit answer offer : ", myPeerConnection.signalingState);
    console.log("send the answer");
});

socket.on("answer", (answer) => {
    console.log("signalingState answer : ", myPeerConnection.signalingState);
    console.log("received the answer");
    myPeerConnection.setRemoteDescription(answer);
    console.log("signalingState setRemoteDescription : ", myPeerConnection.signalingState);
});

socket.on("ice", (ice) => {
    console.log("received candidate");
    console.log("signalingState ice : ", myPeerConnection.signalingState);
    myPeerConnection.addIceCandidate(ice);
    console.log("signalingState addIceCandidate : ", myPeerConnection.signalingState);
});



// RTC Code
function makeConnection(){
    // myPeerConnection = new RTCPeerConnection(); 같은 와이파이 이용할때만 가능
    myPeerConnection = new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                ],
            },
        ],
    }); // STUN서버 필요 (공용ip를 찾게해주는 서버) 현재 구글제공 서버 사용 (webRTC) 구현 필요

    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
    console.log("sent candidate");
    socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
    const peerFace = document.getElementById("peerFace");
    peerFace.srcObject = data.stream;
}


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


//이 아래로 webSocket으로 구현한 채팅
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


