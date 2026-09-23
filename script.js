const expressionEl = document.querySelector('#expression');
const resultEl = document.querySelector('#result');
const displayLabel = document.querySelector('#displayLabel');
const memoryBadge = document.querySelector('#memoryBadge');
const historyList = document.querySelector('#historyList');
const historyCount = document.querySelector('#historyCount');
const toast = document.querySelector('#toast');

let current = '0';
let previous = null;
let operator = null;
let waitingForOperand = false;
let memory = 0;
let history = [];
let toastTimer;

const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function formatNumber(value) {
  if (!Number.isFinite(value)) return 'Error';
  const rounded = Math.round((value + Number.EPSILON) * 1e10) / 1e10;
  return String(rounded).length > 14 ? rounded.toExponential(7) : String(rounded);
}

function updateDisplay() {
  resultEl.textContent = current;
  expressionEl.textContent = previous !== null && operator ? `${formatNumber(previous)} ${symbols[operator]}` : current === '0' ? '0' : current;
  displayLabel.textContent = operator && !waitingForOperand ? 'INPUT' : previous !== null ? 'PENDING' : 'READY';
  memoryBadge.hidden = memory === 0;
}

function calculate(left, right, op) {
  if (op === '+') return left + right;
  if (op === '-') return left - right;
  if (op === '*') return left * right;
  if (op === '/') return right === 0 ? NaN : left / right;
  return right;
}

function reset() {
  current = '0';
  previous = null;
  operator = null;
  waitingForOperand = false;
  updateDisplay();
}

function inputDigit(digit) {
  if (current === 'Error' || waitingForOperand) {
    current = digit;
    waitingForOperand = false;
  } else {
    current = current === '0' ? digit : current + digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (current === 'Error' || waitingForOperand) {
    current = '0.';
    waitingForOperand = false;
  } else if (!current.includes('.')) {
    current += '.';
  }
  updateDisplay();
}

function chooseOperator(nextOperator) {
  const inputValue = Number(current);
  if (current === 'Error') return reset();
  if (previous === null) previous = inputValue;
  else if (operator && !waitingForOperand) {
    const result = calculate(previous, inputValue, operator);
    current = formatNumber(result);
    previous = result;
  }
  operator = nextOperator;
  waitingForOperand = true;
  updateDisplay();
}

function equals() {
  if (operator === null || previous === null || current === 'Error') return;
  const left = previous;
  const right = Number(current);
  const activeOperator = operator;
  const answer = calculate(left, right, activeOperator);
  const formatted = formatNumber(answer);
  addHistory(`${formatNumber(left)} ${symbols[activeOperator]} ${formatNumber(right)}`, formatted);
  current = formatted;
  previous = null;
  operator = null;
  waitingForOperand = true;
  updateDisplay();
}

function toggleSign() {
  if (current !== '0' && current !== 'Error') current = current.startsWith('-') ? current.slice(1) : `-${current}`;
  updateDisplay();
}

function percentage() {
  if (current !== 'Error') current = formatNumber(Number(current) / 100);
  updateDisplay();
}

function addHistory(expression, answer) {
  history.unshift({ expression, answer, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  history = history.slice(0, 8);
  renderHistory();
}

function renderHistory() {
  historyCount.textContent = `${history.length} ${history.length === 1 ? 'ENTRY' : 'ENTRIES'}`;
  if (!history.length) {
    historyList.innerHTML = '<div class="empty-history"><span class="empty-orbit">○</span><p>Your calculations<br>will land here.</p></div>';
    return;
  }
  historyList.innerHTML = history.map((item, index) => `<div class="history-item" data-index="${index}" title="Use result"><span class="history-time">${item.time}</span><div class="history-expression">${item.expression}</div><div class="history-result">= ${item.answer}</div></div>`).join('');
}

function memoryAction(action) {
  const value = Number(current);
  if (action === 'memory-clear') memory = 0;
  if (action === 'memory-recall') { current = formatNumber(memory); waitingForOperand = true; }
  if (action === 'memory-add') memory += value;
  if (action === 'memory-subtract') memory -= value;
  updateDisplay();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 1600);
}

async function copyResult() {
  if (current === 'Error') return;
  try {
    await navigator.clipboard.writeText(current);
    showToast('Result copied');
  } catch {
    showToast('Copy unavailable');
  }
}

function handleAction(action) {
  if (action === 'clear') reset();
  if (action === 'decimal') inputDecimal();
  if (action === 'equals') equals();
  if (action === 'toggle-sign') toggleSign();
  if (action === 'percent') percentage();
  if (action === 'copy') copyResult();
  if (action === 'clear-history') { history = []; renderHistory(); }
  if (action.startsWith('memory-')) memoryAction(action);
}

document.querySelector('.keypad').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  button.classList.add('pressed');
  setTimeout(() => button.classList.remove('pressed'), 110);
  if (button.dataset.value !== undefined) {
    if (/\d/.test(button.dataset.value)) inputDigit(button.dataset.value);
    else chooseOperator(button.dataset.value);
  } else handleAction(button.dataset.action);
});

document.querySelector('.utility-row').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (button) handleAction(button.dataset.action);
});

document.querySelector('.history-panel').addEventListener('click', (event) => {
  const item = event.target.closest('.history-item');
  if (!item) return;
  current = history[Number(item.dataset.index)].answer;
  waitingForOperand = true;
  updateDisplay();
});

document.addEventListener('keydown', (event) => {
  if (event.metaKey && event.key.toLowerCase() === 'k') { event.preventDefault(); document.querySelector('.key').focus(); return; }
  if (/\d/.test(event.key)) inputDigit(event.key);
  else if (event.key === '.') inputDecimal();
  else if (['+', '-', '*', '/'].includes(event.key)) chooseOperator(event.key);
  else if (event.key === 'Enter' || event.key === '=') equals();
  else if (event.key === 'Escape' || event.key.toLowerCase() === 'c') reset();
  else if (event.key === '%') percentage();
});

updateDisplay();
