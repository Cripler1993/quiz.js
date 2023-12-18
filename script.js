let form = document.querySelector(".form__item");
let numberOfQuestions = document.querySelector("#number");
let categoryOfQuestions = document.querySelector("#category");
let difficultyOfQuestions = document.querySelector("#difficulty");
let typeOfQuestions = document.querySelector("#type");

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
  return fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
