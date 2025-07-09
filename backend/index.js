const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const  { GoogleGenAI } =  require("@google/genai") ;



const http = require("http");           
const { Server } = require("socket.io");   
const port = 5000;

const server = http.createServer(app); 

const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000", // Update this
    methods: ["GET", "POST"],
    credentials: true
  }}
);



app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Internshala Backend Service");
});

app.use("/api", router);
connect();



const ai = new GoogleGenAI({ apiKey: "AIzaSyCL52XFhgGUm6DaB9JpMi7VO2tBdv7SB20" });


app.post("/chat", async (req, res) => {
  let {question} = req.body;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    systemInstruction: "You are an internship assistant chatbot. Only answer questions related to internships, applications, tasks, deadlines, or certificates. For off-topic questions, respond with: 'I can only help with internship-related queries.'",
    contents:question,
  });
    res.send(response.text);

})


//socket
const userSocketMap = new Map();
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    userSocketMap.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let [userId, sockId] of userSocketMap.entries()) {
      if (sockId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

const sendStatusNotification = (userId, status) => {
  const messages = {
    accepted: " Congratulations! You've been hired.",
    rejected: " Unfortunately, your application was rejected.",
  };

  const msg = messages[status.toLowerCase()] || " Your application status has been updated.";

  io.to(userId).emit("application-status-changed", {
    status,
    message: msg,
  });

  console.log(`Notification sent to ${userId}: ${msg}`);
};


module.exports.sendStatusNotification = sendStatusNotification;

app.listen(port,()=>{
  console.log("working")
})