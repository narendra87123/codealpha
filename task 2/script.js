function appendValue(value) {
  document.getElementById("display").value += value;
}

function clearDisplay() {
  document.getElementById("display").value = "";
}

function deleteLast() {
  const display = document.getElementById("display");
  display.value = display.value.slice(0, -1);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function toggleHistory() {
  document.getElementById("history").classList.toggle("hidden");
}

function power(n) {
  document.getElementById("display").value += `**${n}`;
}

function factorial() {
  const val = parseInt(document.getElementById("display").value);
  if (isNaN(val)) return;
  let result = 1;
  for (let i = 2; i <= val; i++) result *= i;
  document.getElementById("display").value = result;
  addToHistory(`${val}! = ${result}`);
}

function addToHistory(entry) {
  const ul = document.getElementById("historyList");
  const li = document.createElement("li");
  li.textContent = entry;
  ul.appendChild(li);
}

function clearHistory() {
  document.getElementById("historyList").innerHTML = "";
}

function calculate() {
  const input = document.getElementById("display").value;
  try {
    if (input.includes('[[')) {
      const result = evaluateMatrixExpression(input);
      document.getElementById("display").value = matrixToString(result);
      addToHistory(`${input} = ${matrixToString(result)}`);
    } else {
      const result = eval(input);
      document.getElementById("display").value = result;
      addToHistory(`${input} = ${result}`);
    }
  } catch {
    document.getElementById("display").value = "Error";
  }
}

function parseMatrix(str) {
  return str
    .replace(/^\[\[/, '')
    .replace(/\]\]$/, '')
    .split(';')
    .map(row => row.split(',').map(Number));
}

function matrixToString(matrix) {
  return matrix.map(row => row.join(',')).join(';');
}

function evaluateMatrixExpression(expr) {
  const match = expr.match(/(\[\[.*?\]\])\s*([\+\-\*])\s*(\[\[.*?\]\])/);
  if (!match) throw new Error("Invalid matrix format");

  const [, aStr, operator, bStr] = match;
  const A = parseMatrix(aStr);
  const B = parseMatrix(bStr);

  const rows = A.length;
  const cols = A[0].length;

  if (operator === '+' || operator === '-') {
    const result = [];
    for (let i = 0; i < rows; i++) {
      result[i] = [];
      for (let j = 0; j < cols; j++) {
        result[i][j] = operator === '+' ? A[i][j] + B[i][j] : A[i][j] - B[i][j];
      }
    }
    return result;
  } else if (operator === '*') {
    if (A[0].length !== B.length) throw new Error("Matrix multiplication error");
    const result = Array.from({ length: A.length }, () => Array(B[0].length).fill(0));
    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < B[0].length; j++) {
        for (let k = 0; k < A[0].length; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return result;
  }

  throw new Error("Unsupported matrix operation");
}
document.addEventListener("keydown", function (event) {
  const display = document.getElementById("display");

  if (event.key === "Enter") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Backspace") {
    deleteLast();
  } else if (
    /[0-9+\-*/().%[\],;]/.test(event.key) ||
    event.key === "e"
  ) {
    appendValue(event.key);
  } else if (event.key === "^") {
    appendValue("**");
  }
});

