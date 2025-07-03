const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: 'YOUR_API_KEY' });

async function askBot(question) {
  const internshipKeywords = ['internship', 'intern', 'stipend', 'duration', 'certificate', 'apply'];

  const isInternshipRelated = internshipKeywords.some(keyword =>
    question.toLowerCase().includes(keyword)
  );

  if (!isInternshipRelated) {
    return "I will not answer any question apart from internship.";
  }

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a helpful assistant answering only internship-related questions." },
      { role: "user", content: question },
    ],
  });

  return chatResponse.choices[0].message.content;
}

module.exports = askBot;
