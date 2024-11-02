import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/FirebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import EnvProvider from '../utils/EnvProvider';

const validChords = ["A", "B", "C", "D", "E", "F", "G", "Am", "Bm", "Cm", "Dm", "Em", "Fm", "Gm"];

const SongInputForm = () => {
    const [song, setSong] = useState({
        title: '',
        album: '',
        year: '',
        artists: '',
        genre: '',
        key: '',
        capo: 0,
        data: [],
    });
    const [generatedData, setGeneratedData] = useState(null);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSong({ ...song, [name]: value });
    };

    const handlePartChange = (index, field, value) => {
        const updatedParts = [...song.data];
        updatedParts[index][field] = value;
        setSong({ ...song, data: updatedParts });
    };

    const parseLyrics = (lyrics) => {
        const lines = lyrics.split('\n');
        return lines.map((line, index) => {
            const lineData = {
                line: line.replace(/\[(.*?)\]/g, ''), // Remove chords for plain text
                "line-number": index + 1,
                chords: []
            };

            let match;
            const regex = /\[(.*?)\]/g;

            while ((match = regex.exec(line)) !== null) {
                const chord = match[1];
                if (!validChords.includes(chord)) {
                    alert(`Invalid chord detected: ${chord}`);
                    return;
                }
                lineData.chords.push({ chord, position: match.index });
            }

            return lineData;
        });
    };

    const addSongPart = () => {
        setSong(prevSong => ({
            ...prevSong,
            data: [...prevSong.data, { partName: '', lyrics: '' }] // Add a new song part
        }));
    };

    const removeSongPart = (index) => {
        const updatedParts = song.data.filter((_, partIndex) => partIndex !== index);
        setSong({ ...song, data: updatedParts });
    };

    const collectDistinctChords = () => {
        const chordsSet = new Set();
        song.data.forEach(part => {
            const parsedLyrics = parseLyrics(part.lyrics) || [];
            parsedLyrics.forEach(line => {
                line.chords.forEach(chordObj => chordsSet.add(chordObj.chord));
            });
        });
        return Array.from(chordsSet);
    };

    const generateSongData = () => {
        const parsedParts = song.data.map(part => ({
            partName: part.partName,
            data: parseLyrics(part.lyrics),
        }));
        const distinctChords = collectDistinctChords();

        const data = {
            title: song.title,
            album: song.album || 'Single',
            year: parseInt(song.year) || new Date().getFullYear(),
            artists: song.artists.split(',').map(artist => artist.trim()),
            genre: song.genre.split(',').map(genre => genre.trim()),
            key: song.key,
            capo: song.capo,
            chords: distinctChords,
            data: parsedParts
        };

        setGeneratedData(data);
        return data;
    };

    const saveSongData = async () => {
        try {
            const data = generateSongData();
            const docRef = await addDoc(collection(db, EnvProvider.SONG_COLLECTION), data);
            navigate(`/display/${docRef.id}`);
        } catch (error) {
            console.error("Error saving song:", error);
            alert("Error saving song. Please try again.");
        }
    };

    return (
        <div>
            <button onClick={saveSongData}>Save Song</button>
            <div>
                <h1>Add New Song</h1>
                <input name="title" placeholder="Title" value={song.title} onChange={handleInputChange} />
                <input name="album" placeholder="Album" value={song.album} onChange={handleInputChange} />
                <input name="year" placeholder="Year" value={song.year} onChange={handleInputChange} />
                <input name="artists" placeholder="Artists (comma-separated)" value={song.artists} onChange={handleInputChange} />
                <input name="genre" placeholder="Genres (comma-separated)" value={song.genre} onChange={handleInputChange} />
                <input name="key" placeholder="Key (e.g. C)" value={song.key} onChange={handleInputChange} />
                <input name="capo" placeholder="Capo (e.g. 0, 1, 2, ...)" value={song.capo} onChange={handleInputChange} />

                <h2>Song Parts</h2>
                {song.data.map((part, index) => (
                    <div key={index} style={{ marginBottom: '1em' }}>
                        <input
                            type="text"
                            placeholder="Song Part Name (e.g., Intro, Verse)"
                            value={part.partName}
                            onChange={(e) => handlePartChange(index, 'partName', e.target.value)}
                        />
                        <textarea
                            placeholder="Lyrics with chords, e.g., [G]Hello [C]world"
                            value={part.lyrics}
                            onChange={(e) => handlePartChange(index, 'lyrics', e.target.value)}
                        ></textarea>
                        <button onClick={() => removeSongPart(index)}>Remove</button>
                    </div>
                ))}
                <button onClick={addSongPart}>Add Song Part</button>
            </div>
            <button onClick={generateSongData}>Generate JSON</button>

            {generatedData && (
                <div>
                    <h3>Generated Data:</h3>
                    <pre>{JSON.stringify(generatedData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default SongInputForm;
