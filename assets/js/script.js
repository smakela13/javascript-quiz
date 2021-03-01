var highScoreEl = document.querySelector("#highscore");
var quizTimerEl = document.querySelector("#quizTimer");
var quizGameEl = document.querySelector("#jsQuiz");
var theQuestion = document.querySelector("#question");
var theChoices = document.querySelector("#choices");
var startButton = document.querySelector(".start-button");


var submit;
var questions = 0;
var currentQuestion = 0;
var currentScore = 0;
var endScore = 0;
var gameDuration = 0;
var quizOver = false;
var timer = 80;
var timerN;
var timerRun;
var indexQA = 0;
var cleaningList = [];
var clearTimer = false;
var isCorrect;
var answered = false;


function init() {
    reset();
}

function reset() {
    quizGameEl.innerHTML = "";
    currentScore = 0;
    gameDuration = 0;
    timerRun = false;
    answered = false;
}

function cleanList() {
    for (let i = 0; i < cleaningList.length; i++) {
        cleaningList[i].remove();
    }
}

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
    cleanList();
    renderQuestion();
    timerRun = true;
    clearTimer = false;
    isCorrect = false;
    gameDuration = timer;
    startTimer();
}

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

// Gets answer from user and matches if the answer is correct
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
    console.log("testset");
    console.log(isCorrect);
    console.log(answered);
    if (isCorrect && answered) {
        // correct
        var line = document.createElement("hr");
        line.setAttribute("id", "line");
        theChoices.appendChild(line);
        cleaningList.push(line);

        var correct = document.createElement("p");
        correct.setAttribute("id", "correct");
        correct.textContent = "Correct!";
        theChoices.appendChild(correct);
        cleaningList.push(correct);

    } else if (!isCorrect && answered) {
        // wrong
        var line = document.createElement("hr");
        line.setAttribute("id", "line");
        theChoices.appendChild(line);
        cleaningList.push(line);

        var wrong = document.createElement("p");
        wrong.setAttribute("id", "choice");
        wrong.textContent = "Wrong!";
        theChoices.appendChild(wrong);
        cleaningList.push(wrong);
    }
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
    cleanList();
}

function getResults() {
    var storedScores = JSON.parse(localStorage.getItem("leaderboard"));
    return storedScores;
}

function clearResults() {
    localStorage.setItem("leaderboard", null);
    viewLeaderboard();
}

function viewLeaderboard() {
    cleanList();
    clearTimer = true;
    quizTimerEl.textContent = "";

    var storedResults = getResults();
    if (storedResults !== null) {
        // add leaderboard header to jsQuiz ID
        var leaderboardHead = document.createElement("p");
        leaderboardHead.textContent = "Welcome to the leaderboard!";
        theQuestion.appendChild(leaderboardHead);
        cleaningList.push(leaderboardHead);

        // added leaderboard to questions ID
        for (let i = 0; i < storedResults.length; i++) {
            var entryN = document.createElement("li");
            entryN.setAttribute("id", "name" + i);
            entryN.textContent = storedResults[i].name + " has score of " + storedResults[i].score + ".";
            theQuestion.appendChild(entryN);
            cleaningList.push(entryN);
        }
    } else {
        // let user know no scores exist and ask them to play the game
        var viewResults = document.createElement("h3");
        viewResults.setAttribute("id", "view-results");
        viewResults.textContent = "No scores currently exist! Please take the quiz.";
        theQuestion.appendChild(viewResults);
        cleaningList.push(viewResults);
    }
    
    // need a clear high scores and play again button
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

function saveScore() {
    console.log("save score here");

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
    
    // in case of emergency - localStorage.setItem(initials, endScore);
    localStorage.setItem("leaderboard", JSON.stringify(storedResults));

    submit.style.display = "none";
    viewLeaderboard();
}

function endQuiz() {
    console.log("EndGame");

    quizTimerEl.textContent = "Quiz complete!";
    if (gameDuration < 0) {
        gameDuration = 0;
    }
    endScore = gameDuration * currentScore + currentScore;
    var quizEnd = document.createElement("h3");
    quizEnd.setAttribute("id", "the-end");
    quizEnd.textContent = "The quiz has ended! Here is how many answers you got correct: " + currentScore + " and your time left is: " + gameDuration + " giving you a score of " + endScore + ". Hope you had fun!";
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
    theQuestion.appendChild(playAgain);
    playAgain.addEventListener("click", startQuiz);

    timerRun = false;
    answered = false;

    submit.addEventListener("click", saveScore);
    cleaningList.push(submit, enterInitials, quizEnd, playAgain);
}

highScoreEl.addEventListener("click", viewLeaderboard);
startButton.addEventListener("click", startQuiz);
init();