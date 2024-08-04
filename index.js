document.addEventListener("DOMContentLoaded", (event) => {
  let timer;
  let startTime;
  let elapsedTime = 0;

  const timerDisplay = document.getElementById("timer");
  const titleDisplay = document.getElementById("title");
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");
  const recordButton = document.getElementById("recordButton");
  const recordedTimesList = document.getElementById("recordedTimes");
  const favicon = document.getElementById("favicon");
  function updateTimerDisplay() {
    const time = new Date(elapsedTime);
    const hours = String(time.getUTCHours()).padStart(2, "0");
    const minutes = String(time.getUTCMinutes()).padStart(2, "0");
    const seconds = String(time.getUTCSeconds()).padStart(2, "0");
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    updateTitle(hours, minutes, seconds);
  }
  function updateTitle(hours, minutes, seconds) {
    if (elapsedTime === 0) {
      titleDisplay.textContent = "Study Timer";
      titleDisplay.style.color = "blue";
      favicon.href = "raw/default.png";
    } else if (startButton.disabled && recordButton.disabled) {
      titleDisplay.style.color = "green"; // Timer is running
      favicon.href = "raw/go.png";
      titleDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    } else if (stopButton.disabled) {
      titleDisplay.style.color = "red"; // Timer is stopped
      favicon.href = "raw/stop.png";
      titleDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
  }

  function startTimer() {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateTimerDisplay();
    }, 1000);
    startButton.disabled = true;
    stopButton.disabled = false;
    recordButton.disabled = true;
  }

  function stopTimer() {
    clearInterval(timer);
    startButton.disabled = false;
    stopButton.disabled = true;
    recordButton.disabled = false;
    updateTimerDisplay();
  }

  function recordTime() {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const storedTimes = JSON.parse(localStorage.getItem("studyTimes")) || {};
    if (storedTimes[today]) {
      storedTimes[today] += elapsedTime;
    } else {
      storedTimes[today] = elapsedTime;
    }
    localStorage.setItem("studyTimes", JSON.stringify(storedTimes));
    displayRecordedTimes();
    resetTimer();
  }

  function resetTimer() {
    elapsedTime = 0;
    updateTimerDisplay();
    startButton.disabled = false;
    stopButton.disabled = true;
    recordButton.disabled = true;
  }

  function displayRecordedTimes() {
    const storedTimes = JSON.parse(localStorage.getItem("studyTimes")) || {};
    recordedTimesList.innerHTML = "";
    for (const [date, time] of Object.entries(storedTimes)) {
      const timeString = new Date(time).toISOString().substr(11, 8); // Format: HH:MM:SS
      const listItem = document.createElement("li");
      listItem.textContent = `${date}: ${timeString}`;
      listItem.className = "list-group-item";
      recordedTimesList.appendChild(listItem);
    }
  }

  startButton.addEventListener("click", startTimer);
  stopButton.addEventListener("click", stopTimer);
  recordButton.addEventListener("click", recordTime);

  updateTimerDisplay();
  displayRecordedTimes();
  stopButton.disabled = true;
  recordButton.disabled = true;
});
