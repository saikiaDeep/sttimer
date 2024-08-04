// src/SignIn.js
import React from "react";
import { auth, googleProvider } from "./firebase";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const SignIn = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (user) return <p>Welcome, {user.user.displayName}!</p>;

  return (
    <button onClick={() => signInWithGoogle()}>Sign in with Google</button>
  );
};

export default SignIn;
