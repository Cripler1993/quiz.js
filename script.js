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

let checkContainer = document.querySelector("#check__container");
let playContainer = document.querySelector("#play__container");
let checkBtn = document.querySelector("#check__btn");
let restartBtn = document.querySelector("#play__btn");

let questionAmount = document.querySelector("#all__answers");
let correctAmount = document.querySelector("#correct__answers");

let gameEnd = false;

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
// отправляем фетч запрос(запрос данных с сервера) где в ссылке подставляем парметры указанные у функции
// возвращаем и обрабатываем запрос с сервера
// получаем результат от сервера
//  объявляем переменную newArr в которую присваиваем результат выполнения метода map у ответа сервера с ключом results
//  который меняет каждый элемент массива и возвращает изменный, новый массив
// вызываем функцию renderQuestions которая принимает в себя параметр newArr

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
          options: elem.incorrect_answers
            .concat([elem.correct_answer])
            .sort(function () {
              if (Math.random() > 0.5) {
                return 1;
              } else {
                return -1;
              }
            }),
          selected_answer: null,
        };
      });
      renderQuestions(newArr);
      checkBtn.addEventListener("click", function () {
        gameEnd = true;
        renderQuestions(newArr);
        checkContainer.classList.add("hidden");
        playContainer.classList.remove("hidden");
      });
    });
}

// объявляем функцию renderQuestions параметром принимает в себя arr
// обнуляем внутреннее содержимое документа переменной quizContainer
// открываем цикл для всех элементов arr
// в переменную question присваиваем созданный в html шаблон содержащий вопрос и контейнер для вариантов ответа
// в переменную questionContainer присваиваем элемент элемент с классом question

// к переменной questionContainer добавляем обработчик слушателя событий, открываем функцию которая принимает параметр
// event и используем функцию handleAnswer которая принимает параметры event, element и arr

// получаем в перменную questiontitle элемент заголовка вопроса из шаблона
// получаем в перменную questionAnswers контейнер ответов из шаблона
// содержимому html документа question title присваиваем значение элемента массива с ключом question(вопрос)

// открываем цикл для всех ключей options у элемента массива функкция принимает параметр answerText
//  в переменную answer присваиваем созданный в html шаблон ответа
// в перемнную answerContent присваиваем контейнер одного ответа
// если параметр равен ключу элемента selected_answer
// то добавляем переменной содержащей контейнер одного ответа класс selected
// внутреннему содержимому html документа answerContent присваиваем один из элементов с ключом option(вариант ответа)
// к переменной questionAnswers(контейнер для вариантов ответа) добавляем переменную с шаблоном ответа
// к переменной quizContainer добавялем шаблон содержащий вопрос и контейнер для вариантов ответа

function renderQuestions(arr) {
  correctAmount.innerHTML = 0;
  quizContainer.innerHTML = "";
  questionAmount.innerHTML = arr.length;
  arr.forEach(function (element) {
    let question = questionTemplate.content.cloneNode(true);

    let questionTitle = question.querySelector(".question__title");
    let questionAnswers = question.querySelector(".question__answers");

    questionTitle.innerHTML = element.question;
    let correctIndex = element.options.indexOf(element.correct_answer);
    if (element.selected_answer == correctIndex && gameEnd) {
      correctAmount.innerHTML = +correctAmount.innerHTML + 1;
    }

    element.options.forEach(function (answerText, index) {
      let answer = answerTemplate.content.cloneNode(true);
      let answerContent = answer.querySelector(".question__answer");

      if (index == element.selected_answer && !gameEnd) {
        answerContent.classList.add("selected");
      } else if (index == element.selected_answer && gameEnd) {
        answerContent.classList.add("incorrect");
      }

      if (index == correctIndex && gameEnd) {
        answerContent.classList.add("correct");
      }

      answerContent.innerHTML = answerText;
      if (!gameEnd) {
        answerContent.addEventListener("click", function (event) {
          handleAnswer(index, element, arr);
        });
      }
      questionAnswers.append(answer);
    });

    quizContainer.append(question);
  });
}

// объявляем функцию handleAnswer, принимает в себя параметры event, element и arr
// переменной option присваиваем значение элемента по которому кликнули
// объявляем условие при котором если переменная option имеет класс question__answer(контейнер одного ответа)
// то элемент с ключом selected_answer получает значение внутреннего html содержимого переменной options
// испольщуем функцию renderQuestions c парамаетром arr

function handleAnswer(index, element, arr) {
  element.selected_answer = index;
  renderQuestions(arr);
  let selectedAnswers = document.querySelectorAll(".selected");
  let selectedCount = selectedAnswers.length;
  if (selectedCount == arr.length) {
    checkContainer.classList.remove("hidden");
  }
  console.log(element);
}

restartBtn.addEventListener("click", function () {
  gameEnd = false;
  formSection.classList.remove("hidden");

  quizSection.classList.add("hidden");

  playContainer.classList.add("hidden");
});

// selected answer заносить не текст выбранного вопроса, а его индекс в массиве options
