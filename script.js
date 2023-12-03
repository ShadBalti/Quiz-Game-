const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const submitButton = document.getElementById('submit-btn');
const reviewButton = document.getElementById('review-btn');
const progressBar = document.getElementById('progress-bar');
const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');
const timerElement = document.getElementById('timer');

let questions;
let userAnswers = [];
let currentQuestionIndex = 0;
let timer; // Timer variable

const timerDuration = 20; // Set the timer duration for each question in seconds

// Function to fetch questions from an external JSON file
async function getQuestions() {
  try {
    const response = await fetch('questions.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

// Function to create the quiz HTML dynamically
function buildQuiz() {
  clearInterval(timer); // Clear any existing timers

  const allQuestions = quizContainer.querySelectorAll('.question');

  allQuestions.forEach(question => {
    question.classList.remove('active');
    question.classList.remove('correct');
    question.classList.remove('incorrect');
  });

  const currentQuestion = allQuestions[currentQuestionIndex];
  currentQuestion.classList.add('active');

  updateProgressBar();
  startTimer();
}

// Function to update the progress bar
function updateProgressBar() {
  const percentComplete = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${percentComplete}%`;
  progressBar.setAttribute('aria-valuenow', percentComplete);
}

// Function to play the correct sound effect
function playCorrectSound() {
  correctSound.play();
}

// Function to play the incorrect sound effect
function playIncorrectSound() {
  incorrectSound.play();
}

// Function to display the final results
function showResults() {
  const answerContainers = quizContainer.querySelectorAll('.question');
  let score = 0;

  answerContainers.forEach((question, index) => {
    const selectedOption = question.querySelector(`input[name="question${index}"]:checked`);
    const userAnswer = selectedOption ? selectedOption.value : undefined;

    if (userAnswer === questions[index].correctAnswer) {
      score++;
      question.classList.add('correct');
    } else {
      question.classList.add('incorrect');
    }
  });

  resultContainer.innerHTML = `Your score: ${score} out of ${questions.length}`;
  reviewButton.style.display = 'block'; // Show the review button
}

// Function to handle user clicks on answer options
function handleAnswerClick(userAnswer) {
  userAnswers[currentQuestionIndex] = userAnswer;
}

// Function to start the countdown timer
function startTimer() {
  let timeRemaining = timerDuration;

  function updateTimer() {
    timerElement.textContent = `Time remaining: ${timeRemaining}s`;

    if (timeRemaining === 0) {
      handleTimeUp();
    } else {
      timeRemaining--;
    }
  }

  // Initial update
  updateTimer();

  // Set up the timer to update every second
  timer = setInterval(updateTimer, 1000);
}

// Function to handle the case when time is up
function handleTimeUp() {
  clearInterval(timer); // Clear the timer
  // Handle the case when time is up (e.g., mark the question as incorrect)
  quizContainer.querySelector(`input[name="question${currentQuestionIndex}"]:checked`).disabled = true;
  quizContainer.querySelector(`input[name="question${currentQuestionIndex}"]:checked`).parentNode.classList.add('incorrect');

  // Move to the next question or show results
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    buildQuiz();
  } else {
    showResults();
    updateProgressBar();
  }
}

// Event listener for the submit button
submitButton.addEventListener('click', () => {
  showResults();
  updateProgressBar();
});

// Event listener for user clicks on answer options
quizContainer.addEventListener('change', () => {
  const selectedOption = quizContainer.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
  const userAnswer = selectedOption ? selectedOption.value : undefined;
  handleAnswerClick(userAnswer);
});

// Event listener for the review button
reviewButton.addEventListener('click', () => {
  currentQuestionIndex = 0; // Start the review from the first question
  buildQuiz();
});

// Fetch questions and build the quiz when the page loads
getQuestions().then(loadedQuestions => {
  questions = loadedQuestions;
  buildQuiz();
});
