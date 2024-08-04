// src/App.js
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import SignIn from "./SignIn";
import StudyTimer from "./StudyTimer.js";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  return <div>{user ? <StudyTimer /> : <SignIn />}</div>;
}

export default App;
