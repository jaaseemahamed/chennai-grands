import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdI0SjQwLR4UB77y3jxI52MriE_DvgVh4",
  authDomain: "chennai-grand-residency.firebaseapp.com",
  projectId: "chennai-grand-residency",
  storageBucket: "chennai-grand-residency.firebasestorage.app",
  messagingSenderId: "1038785828055",
  appId: "1:1038785828055:web:94cbd9d2debf45012d0c92",
  measurementId: "G-BFD0TF1TKT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ─── Auth Helpers ───────────────────────────────────────────────────────────

export async function signUp(email, password, name) {
  // Use Firebase Auth from the NPM SDK
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Set the user's display name (non-blocking)
  updateProfile(user, { displayName: name }).catch(console.error);
  
  // Store user profile in Firestore (non-blocking)
  setDoc(doc(db, "users", user.uid), {
    name: name || "",
    email: user.email || "",
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  }, { merge: true }).catch(console.error);

  return {
    localId: user.uid,
    email: user.email,
    displayName: name,
    idToken: await user.getIdToken()
  };
}

export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update last login in Firestore (non-blocking)
  setDoc(doc(db, "users", user.uid), {
    lastLogin: serverTimestamp()
  }, { merge: true }).catch(console.error);

  return {
    localId: user.uid,
    email: user.email,
    displayName: user.displayName,
    idToken: await user.getIdToken()
  };
}

// ─── Session helpers (localStorage) ─────────────────────────────────────────

export function saveSession(user) {
  localStorage.setItem("cgr_user", JSON.stringify({
    uid: user.localId,
    email: user.email,
    name: user.displayName || user.name || "",
    token: user.idToken,
  }));
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem("cgr_user"));
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("cgr_user");
}
