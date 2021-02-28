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


var highScoreEl = document.querySelector("#highscore");
var quizTimerEl = document.querySelector("#quizTimer");
var timerEl = document.querySelector("#timer-count");
var quizGameEl = document.querySelector("#jsQuiz"); // currently unused
var theQuestion = document.querySelector("#question");
var theChoices = document.querySelector("#choices");
var startButton = document.querySelector(".start-button");
var submitButton = document.querySelector("#submit-button")


var questions = 0;
var currentQuestion = 0;
var currentScore = 0;
var gameDuration = 0;
var gameElapsed = 0;
var quizOver = false;
var quizInterval;
var timer;
var timerCount;
var timerRun;
var indexQA = 0;
var cleaningList = [];


function init() {
    reset();

    jsQuiz.addEventListener("click", function () {
        startQuiz(questions);
    });
}

function reset() {
    quizGameEl.innerHTML = "";
    currentScore = 0;
    gameDuration = 0;
    quizInterval;
    timerRun = false;
}

function cleanList() {
    for (let i = 0; i < cleaningList.length; i++) {
        cleaningList[i].remove();
    }
}

function startQuiz() {
    questions = [
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
    ];

    quizOver = false;
    timer = 80;
    currentScore = 0;
    startButton.disabled = true;
    startButton.style.display = "none";
    cleanList();
    renderQuestion();
    timerRun = true;
    startTimer();
}

function startTimer() {
    gameDuration = 80;
    var timerN = setInterval(function () {
    if (gameDuration >= 0 && timerRun) {
        gameDuration--;
        quizTimerEl.textContent = gameDuration;
    }
    else if (gameDuration <= 0) {
        clearInterval(timerN);
        cleanList();
        endQuiz();
    } 
    }, 1000);
}

// Gets answer from user and matches if the answer is correct
function answerCorrect(answerGiven) {
    var isCorrect;
    if (answerGiven === currentQuestion.answer) {
        currentScore++;
        isCorrect = true;
        console.log("CORRECT");
    } else {
        isCorrect = false;
        gameDuration -= 10;
    }
    return isCorrect;
}

function renderQuestion() {
    indexQA = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[indexQA];
    // Made the question and appended it
    var questionN = document.createElement("h2");
    questionN.textContent = currentQuestion.question;    
    theQuestion.appendChild(questionN);
    cleaningList.push(questionN);

    // Made and appended the choices - for loop due to choices being in array
    for (let i = 0; i < currentQuestion.choices.length; i++) {
        var choicesN = document.createElement("li");
        choicesN.setAttribute("id", "choice" + i);
        choicesN.textContent = currentQuestion.choices[i];
        choicesN.addEventListener("click", choiceTaken);
        theChoices.appendChild(choicesN);
        cleaningList.push(choicesN);
    }    
    questions = arrayRemoveQuestion(questions, currentQuestion);
}

function arrayRemoveQuestion(array, child) {
    return array.filter(function (elements) {
        return elements != child;
    });
}

function choiceTaken(elementFrom) {
    var test = elementFrom.target;
    if (gameDuration <= 0) {
        endQuiz();
    } else {
        answerCorrect(test.textContent);

        askedQuestions();
        if (questions.length > 0) {
            renderQuestion();
        } else {
            endQuiz();
        }
    }
}

function askedQuestions() {
    console.log(indexQA);
    /*
    Next remove elements that are already put
    to page to make room for next questions
    */
    //currentQuestion.remove();
    cleanList();
    
}

//currentQuestion.pop();

/* main? for the score
if (answerCorrect() === true) {
    score++;
} else {
    gameDuration -= 10;
} */

//displayScore();

function viewResults() {
    
}

function saveScore() {
    console.log("save score here");
}

function endQuiz() {
    console.log("EndGame");

    quizTimerEl.textContent = "Quiz complete!";
    if (gameDuration < 0) {
        gameDuration = 0;
    }
    var endScore = gameDuration * currentScore + currentScore;
    var quizEnd = document.createElement("h3");
    quizEnd.setAttribute("id", "the-end");
    quizEnd.textContent = "The quiz has ended! Here is how many answers you got correct: " + currentScore + " and your time left is: " + gameDuration + " giving you a score of " + endScore + ". Hope you had fun!";
    quizGameEl.appendChild(quizEnd);

    var enterInitials = document.createElement("input");
    enterInitials.setAttribute("type", "text");
    enterInitials.setAttribute("id", "initials");
    enterInitials.setAttribute("placeholder", "Enter your initials");
    theQuestion.appendChild(enterInitials);

    var submit = document.createElement("button");
    submit.setAttribute("type", "button");
    submit.setAttribute("id", "submit-button");
    submit.setAttribute("placeholder", "Submit");
    theChoices.appendChild(submit);

    timerRun = false;

    submitButton.addEventListener("click", saveScore);
    //reset();
    //cleanList();
}


startButton.addEventListener("click", startQuiz);
init();