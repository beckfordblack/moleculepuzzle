import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyA4bEgqlwAMRyJNdy9KjUaY58Pnhv5eBNs",
    authDomain: "moleculepuzzletest.firebaseapp.com",
    projectId: "moleculepuzzletest",
    storageBucket: "moleculepuzzletest.firebasestorage.app",
    messagingSenderId: "773466807535",
    appId: "1:773466807535:web:fedf2b91b3497412708f1a",
    measurementId: "G-MM8XRLJW78"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit
} from
    "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"

export async function saveScore(name, score) {
    await addDoc(collection(db, "scores"), {
        name: name,
        score: score,
        createdAt: Date.now()
    });
}

export async function getRanking() {
    const q = query(
        collection(db, "scores"),
        orderBy("score", "desc"),
        limit(10)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}
