const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { connect } = require("./db");
const router = require("./Routes/index");
const newRouter = require("./Routes/Otp")
const { GoogleGenAI } = require("@google/genai");
const { setIOInstance } = require("./socketUtils");

const app = express();
const server = http.createServer(app);
const port = 5000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = new Map();

setIOInstance(io);

io.on("connection", (socket) => {
  console.log(" User connected:", socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId);
      userSocketMap.set(userId, socket.id);
      console.log(` User ${userId} joined room`);
    }
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

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Internshala Backend Service");
});

app.use("/api", router);
app.use("/api/otp", newRouter);

connect();

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCL52XFhgGUm6DaB9JpMi7VO2tBdv7SB20", 
});

app.post("/chat", async (req, res) => {
  const { question } = req.body;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    systemInstruction:
      "You are an internship assistant chatbot. Only answer questions related to internships, applications, tasks, deadlines, or certificates.",
    contents: question,
  });

  res.send(response.text);
});

server.listen(port, () => {
  console.log("🚀 Backend running at http://localhost:" + port);
});
