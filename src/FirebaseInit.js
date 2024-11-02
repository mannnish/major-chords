// FirebaseInit.js
import React, { useEffect, useState } from "react";
import firebaseAppPromise from "./utils/FirebaseConfig"; // This will work now
import App from "./App";

const FirebaseInit = () => {
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initFirebase = async () => {
            try {
                await firebaseAppPromise; // This now refers to the default export
                setInitialized(true);
            } catch (err) {
                setError(err);
                console.error("Firebase initialization error:", err);
            }
        };

        initFirebase();
    }, []);

    if (error) return <div>Error initializing Firebase: {error.message}</div>;
    if (!initialized) return <p>Initializing application...</p>;

    return <App />;
};

export default FirebaseInit;
