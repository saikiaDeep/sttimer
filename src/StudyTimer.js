import React, { useState, useEffect } from "react";
import "./StudyTimer.css";
import { auth } from "./firebase";
import { Helmet } from "react-helmet";
import { db } from "./firebase";
import { onValue, ref } from "firebase/database";
import { set } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";

const StudyTimer = () => {
  const [timer, setTimer] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [user] = useAuthState(auth);

  const [records, setRecords] = useState([]);
  useEffect(() => {
    const query = ref(db, `times/${user.uid}`);
    onValue(query, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        const formattedRecords = Object.entries(data).reduce(
          (acc, [date, time]) => {
            acc[date] = time;
            return acc;
          },
          {}
        );
        setRecords(formattedRecords);
      }
    });
  }, []);
  const writeData = (path, data) => {
    const dbRef = ref(db, path);
    set(dbRef, data)
      .then(() => {
        console.log("Data written successfully");
      })
      .catch((error) => {
        console.error("Error writing data:", error);
      });
  };
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
    writeData("times/" + user.uid, updatedRecords);
    setElapsedTime(0);
    setIsRunning(false);
  };

  const getRecordedTimes = (onlyToday) => {
    return Object.entries(records).map(([date, time], index) => {
      const timeString = formatTime(time);
      if (onlyToday === true) {
        if (date === today) {
          return (
            <li className="list-group-item">
              {date}: {timeString}
            </li>
          );
        }
      } else {
        return (
          <li key={index} className="list-group-item">
            {date}: {timeString}
          </li>
        );
      }
    });
  };
  const today = new Date().toISOString().split("T")[0];
  const hasRecords = Object.keys(records).length > 0;
  const hasTodayRecord = records && records[today] !== undefined;

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
          <h3>Today's time : {}</h3>
          <ul id="recordedTimes" className="list-group">
            {hasTodayRecord ? (
              getRecordedTimes(true)
            ) : (
              <li className="list-group-item">No data available</li>
            )}
          </ul>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6 offset-md-3">
          <h3>Recorded Times of {user.displayName} :</h3>
          <ul id="recordedTimes" className="list-group">
            {hasRecords ? (
              getRecordedTimes(false)
            ) : (
              <li className="list-group-item">No data available</li>
            )}
          </ul>
        </div>
        <div className="row mt-5 signout">
          <div className="col-md-6 offset-md-3 text-center">
            <button
              className="btn btn-danger btn-lg mx-2"
              onClick={() => {
                auth.signOut();
                setTitleText("Study Timer");
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
