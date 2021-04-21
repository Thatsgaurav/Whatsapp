import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBpvOODG7ZCX8TSGfZg5qsejM7bq3vhLGk",
  authDomain: "whatsapp-cc282.firebaseapp.com",
  projectId: "whatsapp-cc282",
  storageBucket: "whatsapp-cc282.appspot.com",
  messagingSenderId: "588669277874",
  appId: "1:588669277874:web:675c60f9b4c93ca0969bab",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
