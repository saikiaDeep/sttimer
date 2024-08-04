import React, { useState, useEffect } from "react";
import "./StudyTimer.css";
import { auth } from "./firebase";
import { Helmet } from "react-helmet";
const StudyTimer = () => {
  const [timer, setTimer] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [records, setRecords] = useState(
    JSON.parse(localStorage.getItem("studyTimes")) || {}
  );
  const [titleText, setTitleText] = useState("Study Timer");

  useEffect(() => {
    if (isRunning) {
      setStartTime(Date.now() - elapsedTime);
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    }
    return () => clearInterval(timer);
  }, [isRunning, startTime, elapsedTime]);

  const formatTime = (seconds) => {
    const date = new Date(seconds);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const secs = String(date.getUTCSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };

  const updateTitle = () => {
    if (elapsedTime === 0) {
      setTitleText("Study Timer");
    } else if (isRunning) {
      setTitleText(formatTime(elapsedTime));
    } else {
      setTitleText(formatTime(elapsedTime));
    }
  };

  useEffect(() => {
    updateTitle();
  }, [elapsedTime, isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleRecord = () => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const updatedRecords = { ...records };
    updatedRecords[today] = (updatedRecords[today] || 0) + elapsedTime;
    setRecords(updatedRecords);
    localStorage.setItem("studyTimes", JSON.stringify(updatedRecords));
    setElapsedTime(0);
    setIsRunning(false);
  };

  const getRecordedTimes = () => {
    return Object.entries(records).map(([date, time], index) => {
      const timeString = formatTime(time);
      return (
        <li key={index} className="list-group-item">
          {date}: {timeString}
        </li>
      );
    });
  };

  return (
    <div className="container">
      <Helmet>
        <title>{titleText}</title>
      </Helmet>
      <div className="row mt-5">
        <div className="col-md-6 offset-md-3 text-center">
          <h1 id="title">Study Timer</h1>
          <div id="timer" className="display-4">
            {formatTime(elapsedTime)}
          </div>
          <button
            onClick={handleStart}
            className="btn btn-success btn-lg mx-2"
            disabled={isRunning}
          >
            Start
          </button>
          <button
            onClick={handleStop}
            className="btn btn-danger btn-lg mx-2"
            disabled={!isRunning}
          >
            Stop
          </button>
          <button
            onClick={handleRecord}
            className="btn btn-primary btn-lg mx-2"
            disabled={isRunning}
          >
            Record
          </button>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6 offset-md-3">
          <h2>Recorded Times</h2>
          <ul id="recordedTimes" className="list-group">
            {getRecordedTimes()}
          </ul>
        </div>
        <div className="row mt-5">
          <div className="col-md-6 offset-md-3 text-center">
            <button
              className="btn btn-danger btn-lg mx-2"
              onClick={() => auth.signOut()}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <link id="favicon" rel="icon" href="../raw/default.png" />
    </div>
  );
};

export default StudyTimer;
