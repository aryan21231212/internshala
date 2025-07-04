const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const { GoogleGenAI } = require("@google/genai");

const port = 5000;

app.use(cors())

app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello this is internshala backend");
});

app.use("/api", router);

connect();


const ai = new GoogleGenAI({ apiKey: "AIzaSyCL52XFhgGUm6DaB9JpMi7VO2tBdv7SB20" });

app.post("/chat", async (req, res) => {
  let content = await req.body;
  const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      systemInstruction:"You are an internship assistant chatbot like Internshala support. Only answer questions strictly related to internships. For other questions which are not related to internship you can return I will not answer any question apart from internship",
      contents: `${content.code}`,
    });
    res.json({"respond":response.text});
});


app.listen(port,()=>{
  console.log("server connected")
})