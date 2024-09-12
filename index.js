const screen = document.querySelector(".screen");
const btns = document.querySelectorAll("button");
const numbersBtn = [...btns].filter(
  (btn) =>
    !btn.classList.contains("operator") &&
    !btn.classList.contains("higher-operator")
);
const operatorsBtn = [...btns].filter((btn) =>
  btn.classList.contains("operator")
);
const equalsBtn = document.querySelector(".eql");
const resetBtn = document.querySelector(".ac");
const deleteBtn = document.querySelector(".del");
const operatorsArray = [
  {
    name: "plus",
    method: function (leftOperand, rightOperand) {
      return leftOperand + rightOperand;
    },
  },
  {
    name: "minus",
    method: function (leftOperand, rightOperand) {
      return leftOperand - rightOperand;
    },
  },
  {
    name: "multiply",
    method: function (leftOperand, rightOperand) {
      return leftOperand * rightOperand;
    },
  },
  {
    name: "divide",
    method: function (leftOperand, rightOperand) {
      return leftOperand / rightOperand;
    },
  },
  {
    name: "mod",
    method: function (leftOperand, rightOperand) {
      return leftOperand % rightOperand;
    },
  },
];

let leftOperand;
let rightOperand;
let operator;
let currentResult;
equalsBtn.disabled = true;
let history = [];

function paintScreen(content) {
  screen.textContent = content;
}

function clearScreen() {
  screen.textContent = "";
}

function showSelectedNumbers(e) {
  const target = e.target;
  if (operator) {
    if (rightOperand) {
      rightOperand += target.textContent;
    } else {
      clearScreen();
      rightOperand = target.textContent;
    }
    paintScreen(rightOperand);
    equalsBtn.disabled = false;
    history.push("rightOperand");
  } else {
    if (leftOperand) {
      leftOperand += target.textContent;
    } else {
      leftOperand = target.textContent;
    }
    paintScreen(leftOperand);
    history.push("leftOperand");
  }
}

function operate(e) {
  const target = e.target;
  const operatorName = target.dataset.operator;
  operator = operatorName;
  history.push("operator");
}

function getResult() {
  const operatorObject = operatorsArray.find((el) => el.name === operator);
  const result = operatorObject.method(+leftOperand, +rightOperand);
  currentResult = result;
  paintScreen(result);
  operator = null;
  rightOperand = null;
  leftOperand = null;
  equalsBtn.disabled = true;
  history.push("currentResult");
}

function deleteLastEntered() {
  const lastHistoryItem = history[history.length - 1];
  if (lastHistoryItem === "leftOperand") {
    if (leftOperand.length > 0) {
      leftOperand = leftOperand.slice(0, leftOperand.length - 1);
      paintScreen(leftOperand);
    }else{
        clearHistory();
    }
  } else if (lastHistoryItem === "rightOperand") {
    if (rightOperand.length > 0) {
      rightOperand = rightOperand.slice(0, rightOperand.length - 1);
      paintScreen(rightOperand);
    }else{
        clearHistory();
    }
  } else if (lastHistoryItem === "currentResult") {
    currentResult = currentResult.toString();
    if (currentResult.length > 0) {
      currentResult = currentResult.slice(0, currentResult.length - 1);
      paintScreen(currentResult);
    }else{
        clearHistory();
    }
  } else if (lastHistoryItem === "operator") {
    if (operator.length > 0) {
      operator = null;
    } else{
        clearHistory();
    }
  }
}


function reset() {
  operator = null;
  rightOperand = null;
  leftOperand = null;
  equalsBtn.disabled = true;
  screen.textContent = "";
}

function clearHistory() {
  history = [];
}

numbersBtn.forEach((btn) => {
  btn.addEventListener("click", showSelectedNumbers);
});

operatorsBtn.forEach((operator) => {
  operator.addEventListener("click", operate);
});

equalsBtn.addEventListener("click", getResult);

resetBtn.addEventListener("click", reset);

deleteBtn.addEventListener("click", deleteLastEntered);

