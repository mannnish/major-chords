import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../utils/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import EnvProvider from "../utils/EnvProvider";

const chordMap = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const transposeChord = (chord, steps) => {
    const baseChord = chord.replace(/m|7|dim|aug/, '');
    const chordIndex = chordMap.indexOf(baseChord);
    if (chordIndex === -1) return chord; // Return unchanged if chord is invalid
    const transposedIndex = (chordIndex + steps + chordMap.length) % chordMap.length;
    return chordMap[transposedIndex] + chord.replace(baseChord, '');
};

const SongDisplay = () => {
    const { id } = useParams();
    const [songData, setSongData] = useState(null);
    const [transposeSteps, setTransposeSteps] = useState(0);

    useEffect(() => {
        const fetchSong = async () => {
            const songDoc = await getDoc(doc(db, EnvProvider.SONG_COLLECTION, id));
            if (songDoc.exists()) {
                setSongData(songDoc.data());
            } else {
                alert("No such document!");
            }
        };

        fetchSong();
    }, [id]);

    const handleTranspose = (steps) => {
        setTransposeSteps(transposeSteps + steps);
    };

    const chordsToLine = (chords) => {
        let result = '';
        let lastPosition = 0;

        let counter = 0;
        chords.forEach(chord => {
            const spacesToAdd = chord.position - lastPosition - (counter * 2);
            counter += 1
            if (spacesToAdd > 0) {
                result += ' '.repeat(spacesToAdd);
            }
            result += `[${transposeChord(chord.chord, transposeSteps)}]`;
            lastPosition = chord.position + chord.chord.length + 2;
        });

        return result;
    };

    if (!songData) return <p>Loading...</p>;

    const renderSongParts = () => {
        return (
            <div>
                {songData.data.map((part, partIndex) => (
                    <div key={partIndex} style={{ marginBottom: '1em' }}>
                        <h3>{part.partName || `Part ${partIndex + 1}`}</h3>
                        {part.data.map((lineData, lineIndex) => (
                            <div key={lineIndex}>
                                {lineData.chords && lineData.chords.length > 0 && (
                                    <p style={{ whiteSpace: 'pre' }}>{chordsToLine(lineData.chords)}</p>
                                )}
                                <p>{lineData.line}</p>
                                <br />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <h1>{songData.title}</h1>
            <p>Album: {songData.album}</p>
            <p>Year: {songData.year}</p>
            <p>Artists: {songData.artists?.join(', ') || 'No artists available'}</p>
            <p>Genres: {songData.genre?.join(', ') || 'No genres available'}</p>
            <p>Key: {songData.key}</p>
            <p>Capo: {songData.capo}</p>
            <p>Chords: {songData.chords?.map(chord => transposeChord(chord, transposeSteps)).join(', ') || 'No chords available'}</p>

            <div style={{ margin: '20px 0' }}>
                <button onClick={() => handleTranspose(1)}>Transpose Up (+)</button>
                <button onClick={() => handleTranspose(-1)}>Transpose Down (-)</button>
            </div>

            {songData && songData.data && songData.data.length > 0 && renderSongParts()}
        </div>
    );
};

export default SongDisplay;
