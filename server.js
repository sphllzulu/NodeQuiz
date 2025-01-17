


//readline-sync does not work properly
// const readline = require('readline-sync');

// const questions = [
//   { question: "What is the name of Harry Potter's godfather?", answer: "sirius black" },
//   { question: "Which house at Hogwarts was Harry a part of?", answer: "gryffindor" },
//   { question: "What position does Harry play on the Quidditch team?", answer: "seeker" },
//   { question: "What magical object did Harry use to breathe underwater?", answer: "gillyweed" },
//   { question: "What is the name of the three-headed dog guarding the Philosopher's Stone?", answer: "fluffy" },
// ];

// const timePerQuestion = 10;  
// const totalQuizTime = 30;    
// let currentQuestionIndex = 0; 
// let score = 0;
// let quizTimer;
// let questionTimer;

// function clearLine() {
//   process.stdout.write('\r\x1b[K');
// }

// // here i am handling the question timer
// function startQuestionTimer(onTimeout) {
//   let timeRemaining = timePerQuestion;
//   questionTimer = setInterval(() => {
//     clearLine();
//     process.stdout.write(`Time remaining: ${timeRemaining}s | Your answer: `);
//     timeRemaining--;
//     if (timeRemaining < 0) {
//       clearInterval(questionTimer);
//       console.log('\nTime\'s up!');
//       onTimeout(); 
//     }
//   }, 1000);
// }

// // Countdown function for total quiz duration
// function startQuizTimer() {
//   let totalTimeRemaining = totalQuizTime;
//   quizTimer = setInterval(() => {
//     clearLine();
//     process.stdout.write(`Total quiz time remaining: ${totalTimeRemaining}s`);
//     totalTimeRemaining--;
//     if (totalTimeRemaining < 0) {
//       clearInterval(quizTimer);
//       console.log('\nQuiz time is up!');
//       endQuiz();
//     }
//   }, 1000);
// }


// function askQuestion() {
//   const currentQuestion = questions[currentQuestionIndex];
//   console.log(`\nQuestion ${currentQuestionIndex + 1}: ${currentQuestion.question}`);

//   let answerGiven = false;

//   // Start timer for the current question
//   startQuestionTimer(() => {
//     if (!answerGiven) {
//       moveToNextQuestion();  // Automatically move to the next question when time's up
//     }
//   });

//   const answer = readline.question("Your answer: ");
//   answerGiven = true;
//   clearInterval(questionTimer);  // Clear question timer after answer is given
//   clearLine();

//   // Check the answer
//   if (answer.trim() === "") {
//     console.log("No answer provided. Moving to the next question.");
//   } else if (answer.toLowerCase() === currentQuestion.answer) {
//     console.log("Correct!");
//     score++;
//   } else {
//     console.log("Wrong answer!");
//   }

//   moveToNextQuestion();
// }

// // Function to move to the next question or end the quiz
// function moveToNextQuestion() {
//   currentQuestionIndex++;
//   if (currentQuestionIndex >= questions.length) {
//     endQuiz();
//   } else {
//     setTimeout(askQuestion, 1000);  // Short delay before the next question
//   }
// }

// // Function to end the quiz
// function endQuiz() {
//   clearInterval(quizTimer);  // Clear the total quiz timer
//   console.log("\nThe quiz has ended!");
//   console.log(`Your final score is: ${score}/${questions.length}`);
//   process.exit();  // Exit the Node.js process
// }

// // Function to start the quiz
// function startQuiz() {
//   console.log("Welcome to the PotterHead Quiz!");
//   console.log("The entire quiz will end after 30 seconds, regardless of how many questions you answer.");
//   console.log("Press Enter to start the quiz...");
//   readline.question();  

//   startQuizTimer();  
//   askQuestion();    
// }

// startQuiz();

const readline = require('readline');

const questions = [
  {
    question: "What is the name of Harry Potter's godfather?",
    choices: ['Remus Lupin', 'Sirius Black', 'Arthur Weasley', 'Albus Dumbledore'],
    correctIndex: 1
  },
  {
    question: "Which house at Hogwarts was Harry a part of?",
    choices: ['Slytherin', 'Hufflepuff', 'Ravenclaw', 'Gryffindor'],
    correctIndex: 3
  },
  {
    question: "What position does Harry play on the Quidditch team?",
    choices: ['Keeper', 'Chaser', 'Seeker', 'Beater'],
    correctIndex: 2
  },
  {
    question: "What magical object did Harry use to breathe underwater?",
    choices: ['Gillyweed', 'Bubble-Head Charm', 'Breathing Potion', 'Transfiguration Spell'],
    correctIndex: 0
  },
  {
    question: "What is the name of the three-headed dog guarding the Philosopher's Stone?",
    choices: ['Fang', 'Fluffy', 'Norbert', 'Aragog'],
    correctIndex: 1
  }
];

class QuizGame {
  constructor() {
    this.timePerQuestion = 10;
    this.totalQuizTime = 30;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.quizTimer = null;
    this.questionTimer = null;
    this.isQuizActive = false;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  clearLines(n = 1) {
    for (let i = 0; i < n; i++) {
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(1);
    }
  }

  displayChoices(choices) {
    const letters = ['A', 'B', 'C', 'D'];
    choices.forEach((choice, index) => {
      console.log(`${letters[index]}) ${choice}`);
    });
  }

  isValidChoice(input) {
    return ['a', 'b', 'c', 'd'].includes(input.toLowerCase());
  }

  convertLetterToIndex(letter) {
    return {'a': 0, 'b': 1, 'c': 2, 'd': 3}[letter.toLowerCase()];
  }

  startQuestionTimer() {
    let timeRemaining = this.timePerQuestion;
    
    if (this.questionTimer) {
      clearInterval(this.questionTimer);
    }

    console.log(); // Empty line for timer
    console.log("Your answer (A/B/C/D): "); // Line for input

    return new Promise((resolve) => {
      this.questionTimer = setInterval(() => {
        if (this.isQuizActive) {
          this.clearLines(2);
          console.log(`Time remaining: ${timeRemaining}s`);
          console.log("Your answer (A/B/C/D): ");
          timeRemaining--;
          
          if (timeRemaining < 0) {
            clearInterval(this.questionTimer);
            console.log('\nTime\'s up for this question!');
            resolve('timeout');
          }
        }
      }, 1000);
    });
  }

  startQuizTimer() {
    let totalTimeRemaining = this.totalQuizTime;
    
    this.quizTimer = setInterval(() => {
      if (totalTimeRemaining <= 0) {
        this.endQuiz();
        return;
      }
      
      this.clearLines(1);
      console.log(`Total quiz time remaining: ${totalTimeRemaining}s`);
      totalTimeRemaining--;
    }, 1000);
  }

  async askQuestion() {
    if (!this.isQuizActive) return;

    const currentQuestion = questions[this.currentQuestionIndex];
    console.log(`\nQuestion ${this.currentQuestionIndex + 1}: ${currentQuestion.question}`);
    this.displayChoices(currentQuestion.choices);

    const timerPromise = this.startQuestionTimer();
    const answerPromise = new Promise((resolve) => {
      this.rl.question("", resolve);
    });

    const result = await Promise.race([timerPromise, answerPromise]);

    if (this.questionTimer) {
      clearInterval(this.questionTimer);
    }

    if (result === 'timeout') {
      console.log("No answer provided. Moving to the next question.");
    } else {
      const answer = result.trim().toLowerCase();
      if (!this.isValidChoice(answer)) {
        console.log("Invalid choice. Moving to the next question.");
      } else {
        const answerIndex = this.convertLetterToIndex(answer);
        if (answerIndex === currentQuestion.correctIndex) {
          console.log("Correct! ⚡");
          this.score++;
        } else {
          const correctLetter = ['A', 'B', 'C', 'D'][currentQuestion.correctIndex];
          console.log(`Wrong answer! The correct answer was ${correctLetter}) ${currentQuestion.choices[currentQuestion.correctIndex]}`);
        }
      }
    }

    await this.moveToNextQuestion();
  }

  async moveToNextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex >= questions.length || !this.isQuizActive) {
      this.endQuiz();
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.askQuestion();
    }
  }

  endQuiz() {
    this.isQuizActive = false;
    if (this.quizTimer) clearInterval(this.quizTimer);
    if (this.questionTimer) clearInterval(this.questionTimer);
    
    console.log("\n🎬 The quiz has ended!");
    console.log(`✨ Your final score is: ${this.score}/${questions.length}`);
    
    if (this.score === questions.length) {
      console.log("🏆 Perfect score! You're a true Potterhead!");
    } else if (this.score >= questions.length * 0.7) {
      console.log("🎉 Great job! You really know your Harry Potter!");
    } else if (this.score >= questions.length * 0.5) {
      console.log("📚 Not bad! Maybe time for a series reread?");
    } else {
      console.log("📖 Looks like you need to brush up on your Harry Potter knowledge!");
    }
    
    this.rl.close();
  }

  async startQuiz() {
    console.log("🧙‍♂️ Welcome to the PotterHead Quiz! 🏰");
    console.log("⚡ The entire quiz will end after 30 seconds, regardless of how many questions you answer.");
    console.log("🪄 You have 10 seconds to answer each question.");
    console.log("📝 Answer by typing A, B, C, or D");
    
    await new Promise(resolve => {
      this.rl.question("Press Enter to start the quiz...", resolve);
    });

    console.log(); // Empty line for timer
    this.isQuizActive = true;
    this.startQuizTimer();
    await this.askQuestion();
  }
}

// Start the quiz
const quiz = new QuizGame();
quiz.startQuiz();