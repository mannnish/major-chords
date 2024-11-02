import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import EnvProvider from "./EnvProvider";

const firebaseConfig = {
    apiKey: EnvProvider.API_KEY,
    authDomain: "major-chords-firebase.firebaseapp.com",
    projectId: "major-chords-firebase",
    storageBucket: "major-chords-firebase.firebasestorage.app",
    messagingSenderId: "497657734723",
    appId: "1:497657734723:web:253cba1acdd6918729d6f6"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)

export { firebaseApp, db };
export default firebaseApp; // Add default export