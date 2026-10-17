import { initializeApp } from 
    "https://www.gstatic.com/firebase.js/12.0.0/firebase-app.js";
import { getFirestore } from
    "https://www.gstatic.com/firebase.js/12.0.0/firebase-firestore.js"

const firebaseConfig = {
    const firebaseConfig = {
  apiKey: "AIzaSyA4bEgqlwAMRyJNdy9KjUaY58Pnhv5eBNs",
  authDomain: "moleculepuzzletest.firebaseapp.com",
  projectId: "moleculepuzzletest",
  storageBucket: "moleculepuzzletest.firebasestorage.app",
  messagingSenderId: "773466807535",
  appId: "1:773466807535:web:fedf2b91b3497412708f1a",
  measurementId: "G-MM8XRLJW78"
};
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
