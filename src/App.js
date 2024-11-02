import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SongInputForm from "./add_song/SongInputForm";
import SongDisplay from "./display_song/SongDisplay";
import HomePage from "./home/HomePage";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/input" element={<SongInputForm />} />
                    <Route path="/display/:id" element={<SongDisplay />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;