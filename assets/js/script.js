/* GIVEN I am taking a code quiz
WHEN I click the start button 
        - make a start button
        - page ids for question, answer, and result

THEN a timer starts and I am presented with a question
        - make a timer for entire quiz
        - randomize the questions
        - render the questions
        - render the choices
        - check if correct answer
        - give feedback
        - keep track of current score
        - provide score
        - provide space to write initials
        - save initials and score in localstorage
        - clear high score

WHEN I answer a question
THEN I am presented with another question
WHEN I answer a question incorrectly
THEN time is subtracted from the clock
        - function for incorrect answer that subtracts time

WHEN all questions are answered or the timer reaches 0
THEN the game is over
WHEN the game is over
THEN I can save my initials and my score */

var questions = [
    {
        question: "What company developed Javascript?",
        choices: ["Apple", "Microsoft", "Sun Microsystems", "Netscape"],
        answer: "Netscape"
    }, {
        question: "What HTML tag does JavaScript go inside?",
        choices: ["<head>", "<script>", "<main>", "<footer>"],
        answer: "<script>"
    }, {
        question: "What was JavaScript's original name?",
        choices: ["LiveScript", "ECMAScript", "JavaScript", "Mocha"],
        answer: "Mocha"
    }, {
        question: "What did Microsoft call their reverse-engineered version of JavaScript in 1996?",
        choices: ["McScript", "iScript", "JScript", "Chakra"],
        answer: "JScript"
    }, {
        question: "What is JavaScript best known for?",
        choices: ["Static websites", "Basic styling", "Dynamic, interactive website experience", "Too many pop-up ads"],
        answer: "Dynamic, interactive website experience"
    }, {
        question: "Is JavaScript similar to Java since they are named similarly?",
        choices: ["Yes, JavaScript is a stripped down version of Java", "Yes, JavaScript was built by the same person who developed Java", "No, the names were a coincidence", "No, JavaScript gained its name when Netscape and Sun signed a license agreement"],
        answer: "No, JavaScript gained its name when Netscape and Sun signed a license agreement"
    }
]

console.log(questions);

for (let i = 0; i < questions.length; i++) {
    console.log(questions[i].answer);  
}

console.log("end");

init();
startQuiz();
renderQuestion();
endQuiz();
