const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const submitButton = document.getElementById('submit-btn');

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
function buildQuiz(questions) {
  questions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');

    const questionText = document.createElement('p');
    questionText.textContent = `${index + 1}. ${question.question}`;
    questionElement.appendChild(questionText);

    question.answers.forEach(answer => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `question${index}`;
      radio.value = answer;
      label.appendChild(radio);
      label.appendChild(document.createTextNode(answer));
      questionElement.appendChild(label);
    });

    quizContainer.appendChild(questionElement);
  });
}

// Function to calculate and display the quiz results
function showResults(questions) {
  const answerContainers = quizContainer.querySelectorAll('.question');
  let score = 0;

  questions.forEach((question, index) => {
    const selectedOption = answerContainers[index].querySelector(`input[name="question${index}"]:checked`);
    const userAnswer = selectedOption ? selectedOption.value : undefined;

    if (userAnswer === question.correctAnswer) {
      score++;
      answerContainers[index].style.color = 'green';
    } else {
      answerContainers[index].style.color = 'red';
    }
  });

  resultContainer.innerHTML = `Your score: ${score} out of ${questions.length}`;
}

// Event listener for the submit button
submitButton.addEventListener('click', () => showResults(questions));

// Fetch questions and build the quiz when the page loads
getQuestions().then(loadedQuestions => {
  questions = loadedQuestions;
  buildQuiz(questions);
});
                                             
