import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyClzzaOqS2hAwVeDlQe18NP5b1edXhz1b0",
  authDomain: "atlas-fitness-fecab.firebaseapp.com",
  projectId: "atlas-fitness-fecab",
  storageBucket: "atlas-fitness-fecab.appspot.com",
  messagingSenderId: "96883461337",
  appId: "1:96883461337:web:8c687c9dcc90e27c4502c8",
  measurementId: "G-54MZP51CZ9",
};

export default function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}
