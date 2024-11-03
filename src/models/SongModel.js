class ChordPosition {
    constructor(chord, position) {
        this.chord = chord || ""; // Default to an empty string if chord is null
        this.position = position || 0; // Default to 0 if position is null
    }

    static fromJson(json) {
        return new ChordPosition(json.chord || "", json.position || 0);
    }
}

class LineData {
    constructor(line, lineNumber, chords) {
        this.line = line || ""; // Default to an empty string if line is null
        this.lineNumber = lineNumber || 0; // Default to 0 if lineNumber is null
        this.chords = chords || [];
    }

    static fromJson(json) {
        return new LineData(
            json.line || "",
            json.lineNumber || 0,
            json.chords ? json.chords.map(ChordPosition.fromJson) : []
        );
    }
}

class SongPart {
    constructor(partName, data) {
        this.partName = partName || ""; // Default to an empty string if partName is null
        this.data = data || [];
    }

    static fromJson(json) {
        return new SongPart(
            json.partName || "",
            json.data ? json.data.map(LineData.fromJson) : []
        );
    }
}

export class SongModel {
    constructor(id, title, album, year, artists, genre, key, data, chords) {
        this.id = id || ""; // Default to an empty string if id is null
        this.title = title || ""; // Default to an empty string if title is null
        this.album = album || ""; // Default to an empty string if album is null
        this.year = year || 0; // Default to 0 if year is null
        this.artists = artists || []; // Default to an empty array if artists is null
        this.genre = genre || []; // Default to an empty array if genre is null
        this.key = key || ""; // Default to an empty string if key is null
        this.data = data || []; // Default to an empty array if data is null
        this.chords = chords || []; // Default to an empty array if chords is null
    }

    static fromJson(json) {
        return new SongModel(
            json.id || "",
            json.title || "",
            json.album || "",
            json.year || 0,
            json.artists || [],
            json.genre || [],
            json.key || "",
            json.data ? json.data.map(SongPart.fromJson) : [],
            json.chords || []
        );
    }
}
