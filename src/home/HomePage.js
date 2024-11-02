import React, { useEffect, useState } from "react";
import { db } from "../utils/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import EnvProvider from "../utils/EnvProvider";

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, EnvProvider.SONG_COLLECTION));
                const songList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSongs(songList);
            } catch (error) {
                console.error("Error fetching songs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Song Titles</h1>
            <ul>
                {songs.map(song => (
                    <li key={song.id}>
                        <Link to={`/display/${song.id}`}>{song.title}</Link>
                    </li>
                ))}
            </ul>

            <Link to="/input">
                <button>Add Song</button>
            </Link>
            <p>{process.env.REACT_APP_VERSION || "version-null"}</p>
        </div>
    );
};

export default HomePage;
