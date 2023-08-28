import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Your Firebase configuration here...
  apiKey: "AIzaSyB3YPDFNGScJn1xeHItwcbqBl0OVk0GVTQ",
  authDomain: "todoapp-d1ebf.firebaseapp.com",
  projectId: "todoapp-d1ebf",
  storageBucket: "todoapp-d1ebf.appspot.com",
  messagingSenderId: "638267401863",
  appId: "1:638267401863:web:11af056d8075b9bd3bfa22",
  measurementId: "G-95ZF9NQ32D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Create and export the Firebase authentication instance
const auth = getAuth(app);

// Create and export the Firestore database instance
const db = getFirestore(app);
export { db, auth };
