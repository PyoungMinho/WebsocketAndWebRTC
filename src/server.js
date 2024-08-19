import express from 'express';
import http from 'http';
import {Server, Socket} from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (req, res) => res.render("home"));
app.get("*", (req, res) => res.redirect("/"));


const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

const handleListen = () => console.log('listening on http://localhost:3000');
httpServer.listen(3000,handleListen);

// 아래는 소켓 io를 통한 채팅 구현완료 코드
// const wsServer = new Server(httpServer, {
//     cors: {
//         origin: ["https://admin.socket.io"],
//         credentials: true,
//     },
// });
//
// instrument(wsServer, {
//     auth: false,
// });
// // const wsServer = new Server(httpServer);
//
//
//
// function publicRooms(){
//     const  sids = wsServer.sockets.adapter.sids;
//     const  rooms = wsServer.sockets.adapter.rooms;
//     // const { rooms, sids } = wsServer.sockets.adapter;
//     const publicRoom = [];
//     rooms.forEach(( _,key) => {
//         if(sids.get(key) === undefined){
//             publicRoom.push(key);
//         }
//     });
//     return publicRoom;
// }
//
// function countRoom(roomName){
//    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
// }
//
// wsServer.on("connection",(socket) =>{
//     socket["nickname"]="Anon";
//     socket.onAny((event) => {
//         console.log("adapter " +wsServer.sockets.adapter.sids.keys());
//         console.log(`Socket Event: ${event}`);
//     })
//
//     socket.on("enter_room", (roomName,done)=>{
//         socket.join(roomName);
//         done();
//         socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
//         wsServer.sockets.emit("room_change", publicRooms());
//     });
//
//     socket.on("disconnecting", () => {
//         socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname,countRoom(room)-1));
//     });
//
//     socket.on("disconnect",() => {
//         wsServer.sockets.emit("room_change", publicRooms());
//     });
//
//     socket.on(("new_message"), (msg,room,done) => {
//         socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
//         done();
//     });
//
//     socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
//
// });


// const server = http.createServer(app);
// const wss = new WebSocket.Server({server}); // ws와 http서버를 3000포트에 둘 다 생성
// const sockets = [];
// wss.on("connection", (socket) => { // 익명함수 활용
// wss.on("connection", (socket) => { // 익명함수 활용
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("connected to Browser ✅");
//     socket.on("close", () => console.log("DisConnected from the Browser ❌"));
//     socket.on("message", (msg) =>{
//         const message = JSON.parse(msg);
//
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach((aSocket) =>
//                     aSocket.send(`${socket.nickname}: ${message.payload}`));
//                 break;
//
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//
//     });
// });


