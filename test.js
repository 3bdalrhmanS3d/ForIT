document.addEventListener("DOMContentLoaded", () => {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let wrongAnswers = 0;
    let startTime;
    const userAnswers = []; // لتخزين الإجابات

    const quizContainer = document.getElementById("quiz-container");
    const startButton = document.getElementById("start-test");
    const nextButton = document.getElementById("next-question");
    const finishButton = document.getElementById("finish-test");
    const resultsContainer = document.getElementById("results-container");
    const scoreElement = document.getElementById("score");
    const wrongAnswersElement = document.getElementById("wrong-answers");
    const timeTakenElement = document.getElementById("time-taken");
    const testSelection = document.getElementById("test-selection");
    const testApp = document.getElementById("test-app");

    const testFiles = {
        Test1: "data/Test1.json",
        Test2: "data/Test2.json",
        Test3: "data/Test3.json"
    };
    
    const lectureButton = document.getElementById("go-to-lectures");
    lectureButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to leave? Your test progress will be lost.")) {
            window.location.href = "lectures.html";
        }
    });

    document.querySelectorAll(".test-option").forEach((button) => {
        button.addEventListener("click", () => {
            const selectedTest = button.getAttribute("data-test");
            loadTest(testFiles[selectedTest]);
        });
    });

    function loadTest(file) {
        fetch(file)
            .then((response) => response.json())
            .then((data) => {
                questions = data;
                userAnswers.length = questions.length; // Initialize user answers
                testSelection.style.display = "none";
                testApp.style.display = "block";
            })
            .catch((error) => console.error("Error loading test:", error));
    }
    

    startButton.addEventListener("click", () => {
        if (questions.length === 0) {
            alert("Questions are not loaded yet. Please try again later.");
            return;
        }
        startTime = Date.now();
        startButton.style.display = "none";
        nextButton.style.display = "block";
        loadQuestion();
        updateProgressBar(); // تحديث شريط التقدم عند بدء الاختبار
    });
    

    nextButton.addEventListener("click", () => {
        const selectedOption = document.querySelector(".option.selected");
        if (!selectedOption) {
            alert("Please select an option!");
            return;
        }
    
        userAnswers[currentQuestionIndex] = selectedOption.textContent; // حفظ الإجابة
    
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
            updateProgressBar(); // تحديث شريط التقدم
        } else {
            nextButton.style.display = "none";
            finishButton.style.display = "block";
        }
    });
    
        
    finishButton.addEventListener("click", () => {
        const endTime = Date.now();
        const timeTaken = Math.round((endTime - startTime) / 1000);

        // حساب النتائج
        questions.forEach((q, i) => {
            if (userAnswers[i] === q.Answer) {
                score += 10;
            } else {
                wrongAnswers++;
            }
        });

        displayResults(timeTaken);
    });

    function loadQuestion() {
        const question = questions[currentQuestionIndex];
        quizContainer.innerHTML = `
            <h3>${question.Question}</h3>
            <div class="options">
                ${question.Options.map(
                    (option, index) =>
                        `<div class="option ${
                            userAnswers[currentQuestionIndex] === option ? "selected" : ""
                        }">${option}</div>`
                ).join("")}
            </div>
        `;

        document.querySelectorAll(".option").forEach((option) => {
            option.addEventListener("click", () => {
                document
                    .querySelectorAll(".option")
                    .forEach((opt) => opt.classList.remove("selected"));
                option.classList.add("selected");
            });
        });
    }

    function displayResults(timeTaken) {
        quizContainer.style.display = "none";
        resultsContainer.style.display = "block";
    
        scoreElement.textContent = `Score: ${score}`;
        wrongAnswersElement.textContent = `Wrong Answers: ${wrongAnswers}`;
        timeTakenElement.textContent = `Time Taken: ${timeTaken} seconds`;
    
        const wrongQuestionsDetails = document.createElement("div");
        wrongQuestionsDetails.innerHTML = `<h3>Incorrect Answers:</h3>`;
    
        questions.forEach((q, i) => {
            if (userAnswers[i] !== q.Answer) {
                const questionDetail = document.createElement("div");
                questionDetail.className = "wrong-question";
    
                questionDetail.innerHTML = `
                    <p><strong>Q${i + 1}:</strong> ${q.Question}</p>
                    <p><strong>Your Answer:</strong> ${userAnswers[i] || "No Answer"}</p>
                    <p><strong>Correct Answer:</strong> ${q.Answer}</p>
                `;
                wrongQuestionsDetails.appendChild(questionDetail);
            }
        });
    
        resultsContainer.appendChild(wrongQuestionsDetails);
    }
    
    function updateProgressBar() {
        const progressBar = document.getElementById("progress-bar");
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    }
    
    
});
