import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRphfgzg0naCNsMdSjvDB9jTkMqVnU-V0",
  authDomain: "excelle-461f7.firebaseapp.com",
  projectId: "excelle-461f7",
  storageBucket: "excelle-461f7.firebasestorage.app",
  messagingSenderId: "658161835662",
  appId: "1:658161835662:web:c98f235ef809166b2ab3df",
  measurementId: "G-1MCR25EDCM"
};

// Initialize Firebase (singleton pattern to avoid re-initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Analytics can only be used in browser environment
// let analytics;
// if (typeof window !== "undefined") {
//   analytics = getAnalytics(app);
// }

export { app, auth };
