const form = document.getElementById("survey-form");
const thanks = document.getElementById("thanks");
const result = document.getElementById("result");
const message = document.getElementById("message");
const count = document.getElementById("count");
const again = document.getElementById("again");
const historyList = document.getElementById("history-list");
const historyEmpty = document.getElementById("history-empty");
const clearHistoryButton = document.getElementById("clear-history");

const errors = {
  name: document.getElementById("err-name"),
  mood: document.getElementById("err-mood"),
  favorite: document.getElementById("err-favorite"),
};

message.addEventListener("input", () => {
  count.textContent = String(message.value.length);
});

function loadHistory() {
  return JSON.parse(localStorage.getItem("surveyAnswers") || "[]");
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
    historyEmpty.classList.remove("hidden");
    return;
  }

  historyEmpty.classList.add("hidden");

  history.forEach((item) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const time = document.createElement("time");
    time.className = "history-time";
    time.textContent = formatDate(item.sentAt);

    const title = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = item.name;
    title.append(strong, ` / ${item.mood}`);

    const favorite = document.createElement("div");
    favorite.textContent = `ハマってるもの: ${item.favorite.join(" / ")}`;

    const messageLine = document.createElement("div");
    messageLine.textContent = `メッセージ: ${item.message || "(なし)"}`;

    li.append(time, title, favorite, messageLine);
    historyList.append(li);
  });
}

function clearErrors() {
  Object.values(errors).forEach((el) => {
    el.textContent = "";
  });
}

function validate(data) {
  let ok = true;

  if (!data.name.trim()) {
    errors.name.textContent = "名前を入力してください。";
    ok = false;
  }

  if (!data.mood) {
    errors.mood.textContent = "気分を選択してください。";
    ok = false;
  }

  if (data.favorite.length === 0) {
    errors.favorite.textContent = "最低1つ選んでください。";
    ok = false;
  }

  return ok;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const data = {
    name: form.name.value,
    mood: form.mood.value,
    favorite: [...form.querySelectorAll("input[name='favorite']:checked")].map(
      (el) => el.value,
    ),
    message: form.message.value.trim(),
  };

  if (!validate(data)) {
    return;
  }

  // For now we keep submissions in localStorage so this works without a backend.
  const history = JSON.parse(localStorage.getItem("surveyAnswers") || "[]");
  history.push({ ...data, sentAt: new Date().toISOString() });
  localStorage.setItem("surveyAnswers", JSON.stringify(history));
  renderHistory();

  result.textContent = [
    `名前: ${data.name}`,
    `気分: ${data.mood}`,
    `ハマってるもの: ${data.favorite.join(" / ")}`,
    `メッセージ: ${data.message || "(なし)"}`,
  ].join("\n");

  form.closest(".card").classList.add("hidden");
  thanks.classList.remove("hidden");
});

again.addEventListener("click", () => {
  form.reset();
  count.textContent = "0";
  clearErrors();
  thanks.classList.add("hidden");
  form.closest(".card").classList.remove("hidden");
});

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem("surveyAnswers");
  renderHistory();
});

renderHistory();
