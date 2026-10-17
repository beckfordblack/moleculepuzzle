import { initializeApp } from 
    "https://www.gstatic.com/firebase.js/12.0.0/firebase-app.js";
import { getFirestore } from
    "https://www.gstatic.com/firebase.js/12.0.0/firebase-firestore.js"

const firebaseConfig = {
    apikey: "AIzaaSyA4bEgqlwAMRyJNd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
