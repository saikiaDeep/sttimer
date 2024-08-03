let timer;
let startTime;
let elapsedTime = 0;

function updateTime() {
  const now = new Date().getTime();
  const diff = now - startTime + elapsedTime;
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  document.getElementById("timer").innerText =
    (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
}

function startTimer() {
  if (!timer) {
    startTime = new Date().getTime();
    timer = setInterval(updateTime, 1000);
  }
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    elapsedTime += new Date().getTime() - startTime;
  }
}

function resetTimer() {
  stopTimer();
  elapsedTime = 0;
  document.getElementById("timer").innerText = "00:00";
}

function logTime() {
  const now = new Date();
  const day = now.toLocaleDateString();
  const log = document.getElementById("log");
  const entry = document.createElement("div");
  entry.classList.add("log-entry");
  entry.innerText = `${day}: ${document.getElementById("timer").innerText}`;
  log.appendChild(entry);
}

function checkNewDay() {
  const now = new Date();
  const lastLogDate = localStorage.getItem("lastLogDate");
  if (
    lastLogDate &&
    new Date(lastLogDate).toDateString() !== now.toDateString()
  ) {
    logTime();
    localStorage.setItem("lastLogDate", now);
    resetTimer();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  localStorage.setItem("lastLogDate", now);
  setInterval(checkNewDay, 60000); // Check every minute if a new day has started
});
