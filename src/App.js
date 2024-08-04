import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleRecord = () => {
    const today = new Date().toLocaleDateString();
    setRecords([...records, { date: today, time: formatTime(time) }]);
    setTime(0);
  };

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6 offset-md-3 text-center">
          <h1>Study Timer</h1>
          <div id="timer" className="display-4">
            {formatTime(time)}
          </div>
          <button onClick={handleStart} className="btn btn-success btn-lg mx-2">
            Start
          </button>
          <button onClick={handleStop} className="btn btn-danger btn-lg mx-2">
            Stop
          </button>
          <button
            onClick={handleRecord}
            className="btn btn-primary btn-lg mx-2"
          >
            Record
          </button>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6 offset-md-3">
          <h2>Recorded Times</h2>
          <ul id="recordedTimes" className="list-group">
            {records.map((record, index) => (
              <li key={index} className="list-group-item">
                {record.date}: {record.time}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
