import React from "react";
import { auth } from "./firebase";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "./SignIn.css";

const SignIn = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-muted">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger">Error: {error.message}</p>
      </div>
    );
  if (user)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-success">Welcome, {user.user.displayName}!</p>
      </div>
    );

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Study Timer</h2>
        <button
          type="button"
          className="login-with-google-btn"
          onClick={() => signInWithGoogle()}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
