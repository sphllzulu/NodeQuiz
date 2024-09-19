

# Timed Quiz Application

This project implements an interactive timed quiz application with asynchronous question handling and dynamic progression.

## Features

1. **Timed Questions**
   - Displays remaining time for each question using `setInterval`.
   - Implements a countdown timer for the entire quiz duration.

2. **Asynchronous Question Handling**
   - Questions are asked asynchronously to avoid blocking the main event loop.
   - User input is handled asynchronously using `readline-sync`.

3. **Dynamic Question Progression**
   - Automatically moves to the next question after the current one is answered or time runs out.

4. **Quiz Termination**
   - Stops the quiz if all questions are answered before the time limit.
   - Displays the final score upon quiz completion.

5. **Error Handling**
   - Manages cases of invalid user input.
   - Handles quiz timeout scenarios.

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/sphllzulu/NodeQuiz.git
   ```
2. Navigate to the project directory:
   ```
   cd timed-quiz-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

Run the application using:

```
node server.js
```

Follow the on-screen prompts to participate in the quiz.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

