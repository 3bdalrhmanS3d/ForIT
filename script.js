document.addEventListener("DOMContentLoaded", () => {
    const lectures = {
        "Lec5_6": "data/Lec5_6.json",
        "Lec7_8": "data/Lec7_8.json",
        "Lec9_10_11": "data/Lec9_10_11.json",
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

    let userScore = 0;
    let answeredQuestions = new Set();

    const selectedLecture = localStorage.getItem("selectedLecture");
    if (selectedLecture) {
        loadLecture(selectedLecture);
    }

    function loadLecture(lecture) {
        fetch(lectures[lecture])
            .then(response => {
                if (!response.ok) throw new Error('فشل تحميل المحاضرة');
                return response.json();
            })
            .then(data => {
                quizSection.style.display = "block";
                lectureTitle.textContent = `المحاضرة: ${lecture}`;
                showQuestion(data);
            })
            .catch(error => {
                alert('حدث خطأ في تحميل المحاضرة. الرجاء المحاولة مرة أخرى.');
                console.error(error);
            });
    }

    function showQuestion(questions) {
        let currentQuestionIndex = 0;
        const totalQuestions = questions.length;

        function updateQuestion() {
            const question = questions[currentQuestionIndex];
            renderQuestion(question);
            
            // عرض رقم السؤال
            const questionNumberDisplay = document.getElementById("question-number") || 
                                         document.createElement("div");
            questionNumberDisplay.id = "question-number";
            questionNumberDisplay.textContent = `السؤال ${currentQuestionIndex + 1} من ${totalQuestions}`;
            
            if (!document.getElementById("question-number")) {
                questionContainer.appendChild(questionNumberDisplay);
            }

            // إدارة أزرار التنقل
            prevButton.style.display = currentQuestionIndex > 0 ? "inline-block" : "none";
            nextButton.style.display = "none"; // سيظهر بعد الإجابة الصحيحة
            submitAnswerButton.style.display = "inline-block";
            
            updateProgressBar();
        }

        function updateProgressBar() {
            const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${Math.round(progress)}%`;
        }

        updateQuestion();

        submitAnswerButton.onclick = () => {
            const selectedOption = document.querySelector(".option.selected");
            if (!selectedOption) {
                showNotification("الرجاء اختيار إجابة!", "warning");
                return;
            }

            const isCorrect = selectedOption.textContent === questions[currentQuestionIndex].Answer;
            
            // تعطيل جميع الخيارات
            document.querySelectorAll(".option").forEach(option => {
                option.classList.add("disabled");
            });

            if (isCorrect) {
                selectedOption.classList.add("correct");
                
                // إضافة السؤال للأسئلة المجابة وزيادة النقاط
                if (!answeredQuestions.has(currentQuestionIndex)) {
                    answeredQuestions.add(currentQuestionIndex);
                    userScore++;
                }
                
                showNotification("إجابة صحيحة! 🎉", "success");
                
                submitAnswerButton.style.display = "none";
                
                setTimeout(() => {
                    if (currentQuestionIndex < questions.length - 1) {
                        nextButton.style.display = "inline-block";
                    } else {
                        showCompletionMessage();
                    }
                }, 1500);
            } else {
                selectedOption.classList.add("incorrect");
                showNotification("إجابة خاطئة. حاول مرة أخرى! ❌", "error");
                
                setTimeout(() => {
                    selectedOption.classList.remove("incorrect", "selected");
                    document.querySelectorAll(".option").forEach(option => {
                        option.classList.remove("disabled");
                    });
                }, 1500);
            }
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
                questionNumberInput.value = "";
            } else {
                showNotification("رقم السؤال غير صحيح!", "warning");
            }
        };

        viewResultsButton.onclick = () => {
            displayResults(questions);
        };

        function showCompletionMessage() {
            const percentage = Math.round((userScore / totalQuestions) * 100);
            let message = `أحسنت! لقد أكملت الاختبار 🎊\n`;
            message += `النتيجة: ${userScore} من ${totalQuestions} (${percentage}%)\n\n`;
            
            if (percentage >= 90) {
                message += "أداء ممتاز! 🌟";
            } else if (percentage >= 70) {
                message += "أداء جيد جداً! 👏";
            } else if (percentage >= 50) {
                message += "أداء جيد! استمر 💪";
            } else {
                message += "يمكنك تحسين أدائك! 📚";
            }
            
            alert(message);
            quizSection.style.display = "none";
            viewResultsButton.style.display = "block";
        }
    }

    function renderQuestion(question) {
        questionContainer.innerHTML = `<h3>${question.Question}</h3>`;
        
        // إضافة كود إن وجد
        if (question.CodeOption) {
            const codeBlock = document.createElement("pre");
            codeBlock.className = "code-block";
            codeBlock.textContent = question.CodeOption;
            questionContainer.appendChild(codeBlock);
        }

        // إضافة الخيارات
        question.Options.forEach(optionText => {
            const option = document.createElement("div");
            option.className = "option";
            option.textContent = optionText;

            option.onclick = () => {
                if (!option.classList.contains("disabled")) {
                    document.querySelectorAll(".option").forEach(opt => 
                        opt.classList.remove("selected")
                    );
                    option.classList.add("selected");
                }
            };

            questionContainer.appendChild(option);
        });
    }

    function displayResults(questions) {
        resultsSection.style.display = "block";
        viewResultsButton.style.display = "none";
        
        const percentage = Math.round((userScore / questions.length) * 100);
        
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; margin-bottom: 30px;">
                <h2 style="color: white; font-size: 32px; margin-bottom: 15px;">النتيجة النهائية</h2>
                <p style="font-size: 48px; font-weight: bold; margin: 20px 0;">${userScore} / ${questions.length}</p>
                <p style="font-size: 24px;">${percentage}%</p>
            </div>
            <h3 style="text-align: center; margin: 30px 0;">جميع الأسئلة والإجابات الصحيحة</h3>
        `;
        
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.style.cssText = "margin: 25px 0; padding: 20px; background: #f8f9fa; border-radius: 15px; border-right: 5px solid #667eea;";
            
            questionDiv.innerHTML = `<h3 style="color: #667eea;">السؤال ${index + 1}: ${question.Question}</h3>`;
            
            if (question.CodeOption) {
                const codeBlock = document.createElement("pre");
                codeBlock.className = "code-block";
                codeBlock.textContent = question.CodeOption;
                questionDiv.appendChild(codeBlock);
            }
            
            question.Options.forEach(optionText => {
                const option = document.createElement("div");
                option.textContent = optionText;
                option.style.cssText = "padding: 12px; margin: 8px 0; border-radius: 8px;";
                
                if (optionText === question.Answer) {
                    option.style.background = "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)";
                    option.style.color = "white";
                    option.style.fontWeight = "600";
                    option.innerHTML = `✓ ${optionText} <span style="float: left;">(الإجابة الصحيحة)</span>`;
                } else {
                    option.style.background = "#fff";
                    option.style.border = "1px solid #e0e0e0";
                }
                
                questionDiv.appendChild(option);
            });
            
            resultsContainer.appendChild(questionDiv);
        });

        // إضافة زر العودة
        const backButton = document.createElement("button");
        backButton.textContent = "العودة للمحاضرات";
        backButton.style.cssText = "display: block; margin: 30px auto; padding: 15px 40px; font-size: 18px;";
        backButton.onclick = () => {
            window.location.href = "lectures.html";
        };
        resultsContainer.appendChild(backButton);
    }

    function showNotification(message, type) {
        const notification = document.createElement("div");
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideDown 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        if (type === "success") {
            notification.style.background = "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)";
        } else if (type === "error") {
            notification.style.background = "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)";
        } else {
            notification.style.background = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = "slideUp 0.3s ease";
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // إضافة أنماط الحركة
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translate(-50%, -100px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translate(-50%, 0); opacity: 1; }
            to { transform: translate(-50%, -100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});