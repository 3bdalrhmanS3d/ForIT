document.addEventListener("DOMContentLoaded", () => {
    const lectures = {
        "Lec5_6": "data/Lec5_6.json",
        "Lec7_8": "data/Lec7_8.json"
    };

    const quizSection = document.getElementById("quiz-section");
    const questionContainer = document.getElementById("question-container");
    const lectureTitle = document.getElementById("lecture-title");
    const submitAnswerButton = document.getElementById("submit-answer");
    const viewResultsButton = document.getElementById("view-results");
    const resultsSection = document.getElementById("results-section");
    const resultsContainer = document.getElementById("results-container");
    const questionNumberInput = document.getElementById("question-number-input");
    const goToQuestionButton = document.getElementById("go-to-question");
    const progressBar = document.getElementById("progress-bar");

    const nextButton = document.getElementById("next-question");
    const prevButton = document.getElementById("prev-question");

    const selectedLecture = localStorage.getItem("selectedLecture");
    if (selectedLecture) {
        loadLecture(selectedLecture);
    }

    function loadLecture(lecture) {
        fetch(lectures[lecture])
            .then(response => response.json())
            .then(data => {
                quizSection.style.display = "block";
                lectureTitle.textContent = `Lecture: ${lecture}`;
                showQuestion(data);
            });
    }

    function showQuestion(questions) {
        let currentQuestionIndex = 0;
        const totalQuestions = questions.length;

        function updateQuestion() {
            const question = questions[currentQuestionIndex];
            renderQuestion(question);
            document.getElementById("question-number").textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
            prevButton.style.display = currentQuestionIndex > 0 ? "block" : "none";
            nextButton.style.display = currentQuestionIndex < totalQuestions - 1 ? "block" : "none";
            updateProgressBar();
        }

        function updateProgressBar() {
            const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
            progressBar.style.width = `${progress}%`;
        }

        updateQuestion();

        submitAnswerButton.style.display = "block";
        submitAnswerButton.onclick = () => {
            const selectedOption = document.querySelector(".option.selected");
            if (!selectedOption) return alert("Please select an option!");

            if (selectedOption.textContent === questions[currentQuestionIndex].Answer) {
                selectedOption.classList.add("correct");
            } else {
                selectedOption.classList.add("incorrect");
            }

            document.querySelectorAll(".option").forEach(option => {
                option.classList.add("disabled");
            });

            setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    nextButton.style.display = "block";
                } else {
                    alert("Quiz Completed!");
                    quizSection.style.display = "none";
                    viewResultsButton.style.display = "block";
                }
            }, 2000);
        };

        nextButton.onclick = () => {
            if (currentQuestionIndex < totalQuestions - 1) {
                currentQuestionIndex++;
                updateQuestion();
            }
        };

        prevButton.onclick = () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                updateQuestion();
            }
        };

        goToQuestionButton.onclick = () => {
            const questionNumber = parseInt(questionNumberInput.value) - 1;
            if (questionNumber >= 0 && questionNumber < totalQuestions) {
                currentQuestionIndex = questionNumber;
                updateQuestion();
            } else {
                alert("Invalid question number");
            }
        };

        viewResultsButton.onclick = () => {
            displayResults(questions);
        };
    }

    function renderQuestion(question) {
        questionContainer.innerHTML = `<h3>${question.Question}</h3>`;
        if (question.CodeOption) {
            const codeBlock = document.createElement("pre");
            codeBlock.className = "code-block";
            codeBlock.textContent = question.CodeOption;
            questionContainer.appendChild(codeBlock);
        }
        question.Options.forEach(optionText => {
            const option = document.createElement("div");
            option.className = "option";
            option.textContent = optionText;

            option.onclick = () => {
                document.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
                option.classList.add("selected");
            };

            questionContainer.appendChild(option);
        });

        const questionNumber = document.createElement("div");
        questionNumber.id = "question-number";
        questionContainer.appendChild(questionNumber);
    }

    function displayResults(questions) {
        resultsSection.style.display = "block";
        resultsContainer.innerHTML = "";
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `<h3>Question ${index + 1}: ${question.Question}</h3>`;
            if (question.CodeOption) {
                const codeBlock = document.createElement("pre");
                codeBlock.className = "code-block";
                codeBlock.textContent = question.CodeOption;
                questionDiv.appendChild(codeBlock);
            }
            question.Options.forEach(optionText => {
                const option = document.createElement("div");
                option.textContent = optionText;
                if (optionText === question.Answer) {
                    option.classList.add("correct");
                }
                questionDiv.appendChild(option);
            });
            resultsContainer.appendChild(questionDiv);
        });
    }
});