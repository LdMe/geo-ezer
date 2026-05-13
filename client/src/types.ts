
export interface Coordinate {
    lat: number,
    lng: number
}

export interface Guess {
    userId: String,
    guessedCoordinate: Coordinate,
    distanceMeters?: number,
    score?: number,
    country?: String
}

export interface User {
    id: String,
    username: String
}

export interface GeoImage {
    id: String,
    imageUrl: String,
    realCoordinate: Coordinate
}

export interface GameSession {
    roomId: String,
    status: String,
    players: User[],
    guesses: Guess[]
}