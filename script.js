let form = document.querySelector(".form__item");
let numberOfQuestions = document.querySelector("#number");
let categoryOfQuestions = document.querySelector("#category");
let difficultyOfQuestions = document.querySelector("#difficulty");
let typeOfQuestions = document.querySelector("#type");
let quizContainer = document.querySelector(".quiz__container");
let questionTemplate = document.querySelector("#template");
let answerTemplate = document.querySelector("#answer");
let arr = [
  { question: "как вас зовут?", options: ["как", "никак", "абыкак"] },
  { question: "кто президент России?", options: ["Путин", "Медведев"] },
  {
    question: "куда уехать из России?",
    options: ["Таиланд", "Польша", "Америка", "Франция"],
  },
];

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let amount = numberOfQuestions.value;
  let category = categoryOfQuestions.value;
  let difficulty = difficultyOfQuestions.value;
  let type = typeOfQuestions.value;
  //   console.log(amount, category, difficulty, type);
  getQuiz(amount, category, difficulty, type);
});

function getQuiz(amount, category, difficulty, type) {
  fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function renderQuestions(arr) {
  quizContainer.innerHTML = "";
  arr.forEach(function (element) {
    let question = questionTemplate.content.cloneNode(true);

    let questionTitle = question.querySelector(".question__title");
    let questionAnswers = question.querySelector(".question__answers");

    questionTitle.innerHTML = element.question;

    element.options.forEach(function (answerText) {
      let answer = answerTemplate.content.cloneNode(true);
      let answerContent = answer.querySelector(".question__answer");

      answerContent.innerHTML = answerText;

      questionAnswers.append(answer);
    });

    quizContainer.append(question);
  });
}

renderQuestions(arr);
