const form = document.getElementById("survey-form");
const nameInput = document.getElementById("name");
const availableInput = document.getElementById("available");
const errName = document.getElementById("err-name");
const errAvailable = document.getElementById("err-available");
const statusText = document.getElementById("status");
const historyList = document.getElementById("history-list");
const historyEmpty = document.getElementById("history-empty");
const clearHistoryButton = document.getElementById("clear-history");

const STORAGE_KEY = "surveyAnswers";

function loadHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveHistory(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderHistory() {
  const history = loadHistory().slice().reverse();
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyEmpty.style.display = "block";
    return;
  }

  historyEmpty.style.display = "none";

  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = [
      `${formatDate(item.sentAt)} | ${item.name}`,
      `目標: ${item.goal || "(未記入)"}`,
      `参加可能日時: ${item.available || "(未記入)"}`,
      `詳しく聞きたい分野: ${item.detail || "(未記入)"}`,
      `わからない分野: ${item.unknown || "(未記入)"}`,
    ].join("\n");
    historyList.append(li);
  });
}

function clearErrors() {
  errName.textContent = "";
  errAvailable.textContent = "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();
  statusText.textContent = "";

  const data = {
    name: nameInput.value.trim(),
    goal: form.goal.value.trim(),
    available: availableInput.value.trim(),
    detail: form.detail.value.trim(),
    unknown: form.unknown.value.trim(),
    sentAt: new Date().toISOString(),
  };

  let hasError = false;
  if (!data.name) {
    errName.textContent = "お名前を入力してください。";
    hasError = true;
  }
  if (!data.available) {
    errAvailable.textContent = "参加可能な曜日と時間帯を入力してください。";
    hasError = true;
  }
  if (hasError) {
    return;
  }

  const history = loadHistory();
  history.push(data);
  saveHistory(history);
  renderHistory();

  statusText.textContent = "保存しました。";
  form.reset();
  nameInput.focus();
});

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
  statusText.textContent = "履歴を削除しました。";
});

renderHistory();
