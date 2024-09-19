// const http = require('http');
// const url = require('url');

// const questions = [
//     { question: "What is the name of Harry Potter's godfather?", answer: "Sirius Black" },
//     { question: "Which house at Hogwarts was Harry a part of?", answer: "Gryffindor" },
//     { question: "What position does Harry play on the Quiddich team?", answer: "Seeker" },
//     { question: "What magical object did Harry use to breathe underwater?", answer: "Gillyweed" },
//     { question: "What is the name of the three-headed dog guarding the Philosopher's Stone?", answer: "Fluffy" },
// ];

// let currentQuestionIndex = 0;
// let score = 0;
// let quizTimer;
// let questionTimer;
// let timeRemainingForQuiz = 30; 
// let timeRemainingForQuestion = 10;

// function resetQuiz() {
//     currentQuestionIndex = 0;
//     score = 0;
//     timeRemainingForQuiz = 30;
//     timeRemainingForQuestion = 10;
//     clearInterval(quizTimer);
//     clearInterval(questionTimer);
// }

// function startQuizTimer() {
//     quizTimer = setInterval(() => {
//         timeRemainingForQuiz--;
//         if (timeRemainingForQuiz <= 0) {
//             clearInterval(quizTimer);
//         }
//     }, 1000);
// }

// function startQuestionTimer() {
//     timeRemainingForQuestion = 10;
//     questionTimer = setInterval(() => {
//         timeRemainingForQuestion--;
//         if (timeRemainingForQuestion <= 0) {
//             clearInterval(questionTimer);
//         }
//     }, 1000);
// }

// function getCurrentQuestion() {
//     if (currentQuestionIndex < questions.length) {
//         startQuestionTimer();
//         return {
//             question: questions[currentQuestionIndex].question,
//             timeRemainingForQuestion,
//             timeRemainingForQuiz,
//             currentQuestionIndex: currentQuestionIndex + 1,
//             totalQuestions: questions.length
//         };
//     } else {
//         return null;
//     }
// }

// function checkAnswer(answer) {
//     clearInterval(questionTimer);
//     const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();
//     const isCorrect = answer.toLowerCase() === correctAnswer;
//     if (isCorrect) {
//         score++;
//     }
//     currentQuestionIndex++;
//     return {
//         message: isCorrect ? 'Correct!' : 'Wrong answer!',
//         score,
//         currentQuestionIndex,
//     };
// }

// const server = http.createServer((req, res) => {
//     const parsedUrl = url.parse(req.url, true);
//     const method = req.method;

//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//     if (method === 'OPTIONS') {
//         res.writeHead(204);
//         res.end();
//         return;
//     }

//     if (parsedUrl.pathname === '/start' && method === 'GET') {
//         resetQuiz();
//         startQuizTimer();
//         const questionData = getCurrentQuestion();
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify(questionData));
//     } else if (parsedUrl.pathname === '/question' && method === 'GET') {
//         const questionData = getCurrentQuestion();
//         if (questionData) {
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(questionData));
//         } else {
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: 'Quiz finished!', finalScore: score, totalQuestions: questions.length }));
//         }
//     } else if (parsedUrl.pathname === '/answer' && method === 'POST') {
//         let body = '';
//         req.on('data', (chunk) => {
//             body += chunk.toString();
//         });

//         req.on('end', () => {
//             const answer = JSON.parse(body).answer;
//             const result = checkAnswer(answer);
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(result));
//         });
//     } else if (parsedUrl.pathname === '/end' && method === 'GET') {
//         clearInterval(quizTimer);
//         clearInterval(questionTimer);
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Quiz finished!', finalScore: score, totalQuestions: questions.length }));
//         resetQuiz();
//     } else {
//         res.writeHead(404, { 'Content-Type': 'text/plain' });
//         res.end('Page Not Found');
//     }
// });

// server.listen(3000, () => {
//     console.log('Quiz server running on port 3000');
// });
//   curl http://localhost:3000/start
//  curl -X POST http://localhost:3000/answer -H "Content-Type: application/json" -d '{"answer": "paris"}'





const readline = require('readline-sync');

const questions = [
  { question: "What is the name of Harry Potter's godfather?", answer: "sirius black" },
  { question: "Which house at Hogwarts was Harry a part of?", answer: "gryffindor" },
  { question: "What position does Harry play on the Quidditch team?", answer: "seeker" },
  { question: "What magical object did Harry use to breathe underwater?", answer: "gillyweed" },
  { question: "What is the name of the three-headed dog guarding the Philosopher's Stone?", answer: "fluffy" },
];

const timePerQuestion = 10;  
const totalQuizTime = 30;    
let currentQuestionIndex = 0; 
let score = 0;
let quizTimer;
let questionTimer;

function clearLine() {
  process.stdout.write('\r\x1b[K');
}

// here i am handling the question timer
function startQuestionTimer(onTimeout) {
  let timeRemaining = timePerQuestion;
  questionTimer = setInterval(() => {
    clearLine();
    process.stdout.write(`Time remaining: ${timeRemaining}s | Your answer: `);
    timeRemaining--;
    if (timeRemaining < 0) {
      clearInterval(questionTimer);
      console.log('\nTime\'s up!');
      onTimeout(); 
    }
  }, 1000);
}

// Countdown function for total quiz duration
function startQuizTimer() {
  let totalTimeRemaining = totalQuizTime;
  quizTimer = setInterval(() => {
    clearLine();
    process.stdout.write(`Total quiz time remaining: ${totalTimeRemaining}s`);
    totalTimeRemaining--;
    if (totalTimeRemaining < 0) {
      clearInterval(quizTimer);
      console.log('\nQuiz time is up!');
      endQuiz();
    }
  }, 1000);
}


function askQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  console.log(`\nQuestion ${currentQuestionIndex + 1}: ${currentQuestion.question}`);

  let answerGiven = false;

  // Start timer for the current question
  startQuestionTimer(() => {
    if (!answerGiven) {
      moveToNextQuestion();  // Automatically move to the next question when time's up
    }
  });

  const answer = readline.question("Your answer: ");
  answerGiven = true;
  clearInterval(questionTimer);  // Clear question timer after answer is given
  clearLine();

  // Check the answer
  if (answer.trim() === "") {
    console.log("No answer provided. Moving to the next question.");
  } else if (answer.toLowerCase() === currentQuestion.answer) {
    console.log("Correct!");
    score++;
  } else {
    console.log("Wrong answer!");
  }

  moveToNextQuestion();
}

// Function to move to the next question or end the quiz
function moveToNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= questions.length) {
    endQuiz();
  } else {
    setTimeout(askQuestion, 1000);  // Short delay before the next question
  }
}

// Function to end the quiz
function endQuiz() {
  clearInterval(quizTimer);  // Clear the total quiz timer
  console.log("\nThe quiz has ended!");
  console.log(`Your final score is: ${score}/${questions.length}`);
  process.exit();  // Exit the Node.js process
}

// Function to start the quiz
function startQuiz() {
  console.log("Welcome to the PotterHead Quiz!");
  console.log("The entire quiz will end after 30 seconds, regardless of how many questions you answer.");
  console.log("Press Enter to start the quiz...");
  readline.question();  

  startQuizTimer();  
  askQuestion();    
}

startQuiz();
