import { SongModel } from '../models/SongModel';
import EnvProvider from './EnvProvider'

export const fetchSongs = async () => {
    const response = await fetch(`${EnvProvider.BACKEND_BASE}/songs`);
    if (!response.ok) {
        throw new Error("Failed to fetch songs");
    }
    return await response.json();
};

export const fetchSongById = async (id) => {
    if (id == null || id === undefined) throw Error(`id null`);
    const response = await fetch(`${EnvProvider.BACKEND_BASE}/songs/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch song by id: ${id}`);
    }
    const json = await response.json();
    return SongModel.fromJson(json);
}

export const saveSong = async (songData) => {
    try {
        const response = await fetch(`${EnvProvider.BACKEND_BASE}/songs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(songData),
        });

        if (!response.ok) {
            const tmp = await response.json();
            console.log(tmp);
            throw new Error(tmp.errorMessage || "Error ");
        }

        const result = await response.json();
        return result.id;
    } catch (error) {
        throw new Error(error);
    }
};