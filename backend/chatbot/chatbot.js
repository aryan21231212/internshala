
const internshipQA = require('../internshipQA');

function isInternshipQuestion(message) {
  const keywords = ['internship', 'stipend', 'apply', 'duration', 'intern', 'certificate', 'location'];
  return keywords.some(word => message.toLowerCase().includes(word));
}

function getAnswer(question) {

  const found = internshipQA.find(item =>
    question.toLowerCase().includes(item.question.toLowerCase())
  );
  return found ? found.answer : "Sorry, I couldn't find an answer to that.";
}

async function askBot(question) {
  if (!isInternshipQuestion(question)) {
    return "I will not answer any question apart from internship.";
  }
  return getAnswer(question);
}

module.exports =  askBot ;
