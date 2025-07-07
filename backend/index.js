const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const  { GoogleGenAI } =  require("@google/genai") ;



const port = 5000;


connect();


app.use(cors({
  origin: "http://localhost:3000", // allow only your frontend
  credentials: true,
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Internshala Backend Service");
});

app.use("/api", router);


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

app.listen(port,()=>{
  console.log("working")
})