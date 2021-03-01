// ties the javascript with the HTML ids
var highScoreEl = document.querySelector("#highscore");
var quizTimerEl = document.querySelector("#quizTimer");
var quizGameEl = document.querySelector("#jsQuiz");
var theQuestion = document.querySelector("#question");
var theChoices = document.querySelector("#choices");
var startButton = document.querySelector(".start-button");
var introduction = document.querySelector("#intro");

// global variables for quiz
var submit;
var indexQA = 0;
var questions = 0;
var currentQuestion = 0;
var currentScore = 0;
var endScore = 0;
var isCorrect;
var answered = false;
var quizOver = false;
var gameDuration = 0;
var timer = 80;
var timerN;
var timerRun;
var clearTimer = false;
var cleaningList = [];

// function to initialize
function init() {
    reset();
}

// function resets state of quiz
function reset() {
    quizGameEl.innerHTML = "";
    currentScore = 0;
    gameDuration = 0;
    timerRun = false;
    answered = false;
}

// function clears elements from page after use
function cleanList() {
    for (let i = 0; i < cleaningList.length; i++) {
        cleaningList[i].remove();
    }
}

// function contains questions and leads to quiz starting
function startQuiz() {
    reset();
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
    currentScore = 0;
    startButton.disabled = true;
    startButton.style.display = "none";
    introduction.style.display = "none";
    cleanList();
    renderQuestion();
    timerRun = true;
    clearTimer = false;
    isCorrect = false;
    gameDuration = timer;
    startTimer();
}

// function begins timer and checks if timer should be running
function startTimer() {
    timerN = setInterval(function () {
    if (gameDuration >= 0 && timerRun && !clearTimer) {
        gameDuration--;
        quizTimerEl.textContent = gameDuration;
    }
    else if (gameDuration <= 0 && timerRun && !clearTimer) {
        clearInterval(timerN);
        cleanList();
        endQuiz();
    } 
    if (clearTimer) {
        gameDuration = 0;
        timerRun = false;
        clearInterval(timerN);
    }
    }, 1000);
}

/* function renders the random question dynamically on the page 
* and makes sure questions aren't repeated
* also provides feedback to user if their answer is correct or wrong */
function renderQuestion() {
    indexQA = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[indexQA];
    // questions appended to page
    var questionN = document.createElement("h2");
    questionN.textContent = currentQuestion.question;    
    theQuestion.appendChild(questionN);
    cleaningList.push(questionN);
    // appended the choices, for loop due to choices being in array
    for (let i = 0; i < currentQuestion.choices.length; i++) {
        var choicesN = document.createElement("li");
        choicesN.setAttribute("id", "choice");
        choicesN.textContent = currentQuestion.choices[i];
        choicesN.addEventListener("click", choiceTaken);
        theChoices.appendChild(choicesN);
        cleaningList.push(choicesN);
    }    
    questions = arrayRemoveQuestion(questions, currentQuestion);
    // correct answers
    if (isCorrect && answered) {
        var lineC = document.createElement("hr");
        lineC.setAttribute("id", "line");
        theChoices.appendChild(lineC);
        cleaningList.push(lineC);

        var correct = document.createElement("p");
        correct.setAttribute("id", "correct");
        correct.textContent = "Correct!";
        theChoices.appendChild(correct);
        cleaningList.push(correct);
    }
    // wrong answers
    else if (!isCorrect && answered) {
        var lineW = document.createElement("hr");
        lineW.setAttribute("id", "line");
        theChoices.appendChild(lineW);
        cleaningList.push(lineW);

        var wrong = document.createElement("p");
        wrong.setAttribute("id", "wrong");
        wrong.textContent = "Wrong!";
        theChoices.appendChild(wrong);
        cleaningList.push(wrong);
    }
}

// makes sure repeat questions are removed from array
function arrayRemoveQuestion(array, child) {
    return array.filter(function (elements) {
        return elements != child;
    });
}

/* function gets answer from user and checks if the answer is correct
* if not, user is penalized by taking away 10 seconds */
function answerCorrect(answerGiven) {
    isCorrect;
    answered = true;
    if (answerGiven === currentQuestion.answer) {
        currentScore++;
        isCorrect = true;
    } else {
        isCorrect = false;
        gameDuration -= 10;
    }
    return isCorrect;
}

/* sees what choice the user picks and ends quiz 
* depending on time or if there are questions 
* remaining to be asked */
function choiceTaken(elementFrom) {
    var clickN = elementFrom.target;
    if (gameDuration <= 0) {
        endQuiz();
    } else {
        answerCorrect(clickN.textContent); 
        cleanList();
        if (questions.length > 0) {
            renderQuestion();
        } else {
            endQuiz();
        }
    }
}

/* allows the user to view leaderboard and see current scores
* tells user to take quiz if no scores are found */
function viewLeaderboard() {
    cleanList();
    clearTimer = true;
    quizTimerEl.textContent = "";
    startButton.style.display = "none";
    introduction.style.display = "none";

    var storedResults = getResults();
    if (storedResults !== null) {
        var leaderboardHead = document.createElement("h2");
        leaderboardHead.setAttribute("id", "leader-head");
        leaderboardHead.textContent = "Welcome to the leaderboard!";
        theQuestion.appendChild(leaderboardHead);
        cleaningList.push(leaderboardHead);

        for (let i = 0; i < storedResults.length; i++) {
            var entryN = document.createElement("li");
            entryN.setAttribute("id", "lead-scores");
            entryN.textContent = storedResults[i].name + "'s score is " + storedResults[i].score + ".";
            theQuestion.appendChild(entryN);
            cleaningList.push(entryN);
        }
    }
    // lets user know no scores exist and asks them to play the game
    else {
        var viewResults = document.createElement("h2");
        viewResults.setAttribute("id", "view-results");
        viewResults.textContent = "No scores currently exist! Please take the quiz.";
        theQuestion.appendChild(viewResults);
        cleaningList.push(viewResults);
    }
    // clear high scores and play again buttons
    var clearBoardBtn = document.createElement("button");
    clearBoardBtn.setAttribute("type", "button");
    clearBoardBtn.setAttribute("id", "clear-button");
    clearBoardBtn.innerHTML = "Clear High Scores";
    theChoices.appendChild(clearBoardBtn);
    clearBoardBtn.addEventListener("click", clearResults);

    var playAgain = document.createElement("button");
    playAgain.setAttribute("type", "button");
    playAgain.setAttribute("id", "again-button");
    playAgain.innerHTML = "Play Again";
    theChoices.appendChild(playAgain);
    playAgain.addEventListener("click", startQuiz);

    cleaningList.push(clearBoardBtn, playAgain);
}

// saves the user's initials and score to local storage
function saveScore() {
    var initials = document.querySelector("#initials").value;
    var storedResults = getResults();
    var leaderboardItem = {
        "name": initials,
        "score": endScore,
    };
    if (storedResults !== null) {
        storedResults.push(leaderboardItem);
    } else {
        storedResults = [leaderboardItem];
    }
    localStorage.setItem("leaderboard", JSON.stringify(storedResults));
    submit.style.display = "none";
    viewLeaderboard();
}

// gets results for leaderboard
function getResults() {
    var storedScores = JSON.parse(localStorage.getItem("leaderboard"));
    return storedScores;
}

// clears the results on leaderboard
function clearResults() {
    localStorage.setItem("leaderboard", null);
    viewLeaderboard();
}

/* end of the quiz where user finds out score and is asked
* to put in their initials and if they want to play again
* without entering their initials */
function endQuiz() {
    quizTimerEl.textContent = "Quiz complete!";
    if (gameDuration < 0) {
        gameDuration = 0;
    }
    endScore = gameDuration * currentScore + currentScore;
    var quizEnd = document.createElement("p");
    quizEnd.setAttribute("id", "the-end");
    quizEnd.innerHTML = "The quiz has ended. <br /> You answered " + currentScore + " questions correctly with " + gameDuration + " seconds left. Your score is " + endScore + ". <br /> Hope you had fun!";
    quizGameEl.appendChild(quizEnd);

    var enterInitials = document.createElement("input");
    enterInitials.setAttribute("type", "text");
    enterInitials.setAttribute("id", "initials");
    enterInitials.setAttribute("placeholder", "Enter your initials");
    theQuestion.appendChild(enterInitials);

    submit = document.createElement("button");
    submit.setAttribute("type", "button");
    submit.setAttribute("id", "submit-button");
    submit.innerHTML = "Submit";
    theQuestion.appendChild(submit);

    var playAgain = document.createElement("button");
    playAgain.setAttribute("type", "button");
    playAgain.setAttribute("id", "again-button");
    playAgain.innerHTML = "Play Again";
    theChoices.appendChild(playAgain);
    playAgain.addEventListener("click", startQuiz);

    timerRun = false;
    answered = false;

    submit.addEventListener("click", saveScore);
    cleaningList.push(submit, enterInitials, quizEnd, playAgain);
}

/* event listeners that allow user to start quiz or view leaderboard 
* from initial load and init that calls to init function when page loads */
highScoreEl.addEventListener("click", viewLeaderboard);
startButton.addEventListener("click", startQuiz);
init();