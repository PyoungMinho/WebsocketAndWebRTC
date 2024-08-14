import express from 'express';
import http from 'http';
import { Server } from "socket.io";
// import {WebSocket} from "ws";


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (req, res) => res.render("home"));
app.get("*", (req, res) => res.redirect("/"));



const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection",(socket) =>{
    socket["nickname"]="Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    })

    socket.on("enter_room", (roomName,done)=>{
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
    });

    socket.on(("new_message"), (msg,room,done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });

    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));

});


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

const handleListen = () => console.log('listening on http://localhost:3000');
httpServer.listen(3000,handleListen);
