const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const  { GoogleGenAI } =  require("@google/genai") ;

// const ai = new GoogleGenAI({});

const port = 5000;

// Database connection
connect();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Internshala Backend Service");
});

app.use("/api", router);

// Initialize Google Generative AI
const ai = new GoogleGenAI({ apiKey: "AIzaSyCL52XFhgGUm6DaB9JpMi7VO2tBdv7SB20" });

// Strict internship-focused chatbot
app.post("/chat", async (req, res) => {
  let {question} = req.body;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    systemInstruction: "You are an internship assistant chatbot. Only answer questions related to internships, applications, tasks, deadlines, or certificates. For off-topic questions, respond with: 'I can only help with internship-related queries.'",
    contents:question,
  });
    res.send(response.text);

})

app.listen(port,()=>{
  console.log("working")
})