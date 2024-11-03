import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Api from "../utils/Api";
import { SongModel } from "../models/SongModel";
import EnvProvider from "../utils/EnvProvider";

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const loadSongs = async () => {
            try {
                const songData = await Api.fetchSongs();
                const songList = songData.map(SongModel.fromJson);
                setSongs(songList);
            } catch (error) {
                console.error("Error fetching songs:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSongs();
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
            <p>{EnvProvider.VERSION || "version-null"}</p>
        </div>
    );
};

export default HomePage;