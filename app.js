document.addEventListener('DOMContentLoaded', () => {
    const questionText = document.getElementById('question-text');
    const choicesContainer = document.getElementById('choices-container');
    const choices = document.querySelectorAll('.choice');
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    const resultTableBody = document.querySelector('#result-table tbody');
    const timerDisplay = document.getElementById('timer');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');

    let currentQuestionIndex = 0;
    let questions = [];
    let answers = [];
    let timer;

    // Fetch questions from API
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            questions = data.slice(0, 10);
            startQuiz();
        });

    function startQuiz() {
        currentQuestionIndex = 0;
        answers = [];
        resultTableBody.innerHTML = '';
        showQuestion(currentQuestionIndex);
        questionContainer.style.display = 'block';
        resultContainer.style.display = 'none';
    }

    function showQuestion(index) {
        const question = questions[index];
        questionText.innerText = question.title;
        const words = question.body.split(' ');

        choices.forEach((choice, i) => {
            choice.innerText = words[i] || `Option ${String.fromCharCode(65 + i)}`;
            choice.dataset.answer = choice.innerText;
            choice.classList.remove('active');
            choice.classList.remove('selected');
            choice.disabled = true;  // İlk başta şıkları devre dışı bırak
        });

        questionContainer.style.display = 'block';
        let timeLeft = 30;
        timerDisplay.innerText = `Kalan zaman: ${timeLeft}s`;

        timer = setInterval(() => {
            if (timeLeft === 20) {
                choices.forEach(choice => {
                    choice.classList.add('active');
                    choice.disabled = false;
                });
            }
            if (timeLeft === 0) {
                clearInterval(timer);
                saveAnswer();
                nextQuestion();
            }
            timeLeft--;
            timerDisplay.innerText = `Kalan zaman: ${timeLeft}s`;
        }, 1000);
    }

    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            answers[currentQuestionIndex] = choice.dataset.answer;
            choices.forEach(c => c.classList.remove('selected'));
            choice.classList.add('selected');
        });
    });

    nextBtn.addEventListener('click', () => {
        clearInterval(timer);
        saveAnswer();
        nextQuestion();
    });

    restartBtn.addEventListener('click', () => {
        startQuiz();
    });

    function saveAnswer() {
        if (!answers[currentQuestionIndex]) {
            answers[currentQuestionIndex] = 'No answer';
        }
    }

    function nextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            endQuiz();
        }
    }

    function endQuiz() {
        questionContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        answers.forEach((answer, i) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${questions[i].title}</td><td>${answer}</td>`;
            resultTableBody.appendChild(row);
        });
    }
});
