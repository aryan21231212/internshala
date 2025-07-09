const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { connect } = require("./db");
const router = require("./Routes/index");
const { GoogleGenAI } = require("@google/genai");
const { setIOInstance } = require("./socketUtils"); // ✅ NEW

const app = express();
const server = http.createServer(app);
const port = 5000;

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // ✅ Adjust for production
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store user socket mappings
const userSocketMap = new Map();

// Attach IO instance globally via helper
setIOInstance(io); // ✅ NEW

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

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Internshala Backend Service");
});

// Routes
app.use("/api", router);

// DB Connection
connect();

// Gemini AI route (if still needed)
const ai = new GoogleGenAI({
  apiKey: "AIzaSyCL52XFhgGUm6DaB9JpMi7VO2tBdv7SB20", // 🔐 Consider moving this to .env
});

app.post("/chat", async (req, res) => {
  const { question } = req.body;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    systemInstruction:
      "You are an internship assistant chatbot. Only answer questions related to internships, applications, tasks, deadlines, or certificates. For off-topic questions, respond with: 'I can only help with internship-related queries.'",
    contents: question,
  });

  res.send(response.text);
});

// Start Server
server.listen(port, () => {
  console.log("✅ Backend working on port", port);
});
