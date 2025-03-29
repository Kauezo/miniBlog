import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check if user is logged in
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Register
  const register = async (displayName, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, { displayName });

      // Create user document
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: "",
        bio: "",
      });

      setLoading(false);
      return res.user;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      return res.user;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
