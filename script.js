let form = document.querySelector(".form__item");
let numberOfQuestions = document.querySelector("#number");
let categoryOfQuestions = document.querySelector("#category");
let difficultyOfQuestions = document.querySelector("#difficulty");
let typeOfQuestions = document.querySelector("#type");

let formSection = document.querySelector(".form");
let quizSection = document.querySelector(".quiz");

let quizContainer = document.querySelector(".quiz__container");
let questionTemplate = document.querySelector("#template");
let answerTemplate = document.querySelector("#answer");

// let arr = [
//   { question: "как вас зовут?", options: ["как", "никак", "абыкак"] },
//   { question: "кто президент России?", options: ["Путин", "Медведев"] },
//   {
//     question: "куда уехать из России?",
//     options: ["Таиланд", "Польша", "Америка", "Франция"],
//   },
// ];

// к переменной form добавялем обработчик слушателей события (событие отправки)
// у места где произошло событие блокируем события происходящие по умолчанию
// добавляем активный класс hidden форме и убираем его у викторины
// переменным amount, category, difficulty, type присваиваем значение указанных переменных(значение option)
// вызываем функцию getQuiz которая параметрами принимает amount, category, difficulty, type

form.addEventListener("submit", function (event) {
  event.preventDefault();
  formSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  let amount = numberOfQuestions.value;
  let category = categoryOfQuestions.value;
  let difficulty = difficultyOfQuestions.value;
  let type = typeOfQuestions.value;
  //   console.log(amount, category, difficulty, type);
  getQuiz(amount, category, difficulty, type);
});

// объявляем функцию getQuiz передаем параметры
// отправляем фетч запрос(запрос данных с сервера) где в ссылке подставляем пармаетры указанные у функции
// возвращаем и обрабатываем запрос с сервера
// получаем результат от сервера

function getQuiz(amount, category, difficulty, type) {
  fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let newArr = data.results.map(function (elem) {
        return {
          question: elem.question,
          correct_answer: elem.correct_answer,
          options: elem.incorrect_answers.concat([elem.correct_answer]),
          selected_answer: null,
        };
      });
      renderQuestions(newArr);
    });
}

// объявляем функцию renderQuestions параметром принимает в себя arr
// обнуляем внутреннее содержимое документа переменной quizContainer
// открываем цикл для всех элементов arr
// в переменную question присваиваем созданный в html шаблон содержащий вопрос и контейнер для вариантов ответа
// получаем в перменную questiontitle элемент заголовка вопроса из шаблона
// получаем в перменную questionAnswers контейнер ответов из шаблона
// содержимому html документа question title присваиваем значение элемента массива с ключом question(вопрос)

// открываем цикл для всех ключей options у элемента массива функкция принимает параметр answerText
//  в переменную answer присваиваем созданный в html шаблон ответа
// в перемнную answerContent присваиваем контейнер 1-ого ответа
// внутреннему содержимому html документа answerContent присваиваем один из элементов с ключом option(вариант ответа)
// к переменной questionAnswers(контейнер для вариантов ответа) добавляем переменную с шаблоном ответа
// к переменной quizContainer добавялем шаблон содержащий вопрос и контейнер для вариантов ответа

function renderQuestions(arr) {
  quizContainer.innerHTML = "";
  arr.forEach(function (element) {
    let question = questionTemplate.content.cloneNode(true);
    let questionContainer = question.querySelector(".question");

    questionContainer.addEventListener("click", function (event) {
      handleAnswer(event, element, arr);
    });

    let questionTitle = question.querySelector(".question__title");
    let questionAnswers = question.querySelector(".question__answers");

    questionTitle.innerHTML = element.question;

    element.options.forEach(function (answerText) {
      let answer = answerTemplate.content.cloneNode(true);
      let answerContent = answer.querySelector(".question__answer");
      if (answerText == element.selected_answer) {
        answerContent.classList.add("selected");
      }

      answerContent.innerHTML = answerText;

      questionAnswers.append(answer);
    });

    quizContainer.append(question);
  });
}
function handleAnswer(event, element, arr) {
  let option = event.target;
  if (option.classList.contains("question__answer")) {
    element.selected_answer = option.innerHTML;
    renderQuestions(arr);
    console.log(element);
  }
}

// selected answer заносить не текст выбранного вопроса, а его индекс в массиве options
