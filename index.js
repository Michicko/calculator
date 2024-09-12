const screen = document.querySelector(".screen");
const btns = document.querySelectorAll("button");
const equalsBtn = document.querySelector(".eql");
const resetBtn = document.querySelector(".ac");
const deleteBtn = document.querySelector(".del");

const numbersBtn = [...btns].filter(
  (btn) =>
    !btn.classList.contains("operator") &&
    !btn.classList.contains("higher-operator")
);

const operatorsBtn = [...btns].filter((btn) =>
  btn.classList.contains("operator")
);

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
      if(rightOperand === 0) return 'ERROR';
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
let history = [];

equalsBtn.disabled = true;
paintScreen(0);

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
    removeActiveClassFromAllOperators();
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
  const lastHistoryItem = history[history.length - 1];
  const target = e.target;
  target.classList.add('active');
  const operatorName = target.dataset.operator;
  operator = operatorName;

  if(lastHistoryItem === 'currentResult'){
    leftOperand = currentResult;
    currentResult = null;
    equalsBtn.disabled = false;
  }

  if(lastHistoryItem === 'rightOperand'){
    const result = getResult();
    leftOperand = result;
    paintScreen(result);
    rightOperand = null;
  }
  
  history.push(`${operatorName} operator`);
}

function getResult() {
  const operatorObject = operatorsArray.find((el) => el.name === operator);
  const result = operatorObject.method(+leftOperand, +rightOperand);
  currentResult = result;
  return result
}

function paintResultToScreen(){
  removeActiveClassFromAllOperators();
  const result = getResult();
  paintScreen(result);
  reset(true);
  history.push("currentResult");
}

function removeActiveClassFromAllOperators(){
    operatorsBtn.forEach((el) => el.classList.remove('active'));
}

function deleteLastEntered() {
  const lastHistoryItem = history[history.length - 1];

  if(!lastHistoryItem) return;

  if (lastHistoryItem === "leftOperand") {
    if (leftOperand.length > 0) {
      leftOperand = leftOperand.slice(0, leftOperand.length - 1);
      paintScreen(leftOperand);
      history.pop();
    }

    if(leftOperand.length === 0){
      paintScreen(0);
      clearHistory();
    }
    
  } else if (lastHistoryItem === "rightOperand") {
    if (rightOperand.length > 0) {
      rightOperand = rightOperand.slice(0, rightOperand.length - 1);
      paintScreen(rightOperand);
      history.pop();
    }

    if(rightOperand.length === 0){
      paintScreen(leftOperand);
    }

  } else if (lastHistoryItem === "currentResult") {
    currentResult = currentResult.toString();

    if (currentResult.length > 0) {
      currentResult = currentResult.slice(0, currentResult.length - 1);
      paintScreen(currentResult);
    }

    if(currentResult.length === 0){
      paintScreen(0);
      clearHistory();
    }

  } else if (lastHistoryItem.includes("operator")) {
    if (operator.length > 0) {
      operator = null;
      history.pop();
      removeActiveClassFromAllOperators();
      paintScreen(leftOperand);
    }
  }
}


function reset(showCurrentResult) {
  operator = null;
  rightOperand = null;
  leftOperand = null;
  equalsBtn.disabled = true;

  if(showCurrentResult){
    paintScreen(currentResult);
  } else{
    paintScreen(0);
  }
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

equalsBtn.addEventListener("click", paintResultToScreen);

resetBtn.addEventListener("click", ()=> reset(false));

deleteBtn.addEventListener("click", deleteLastEntered);

