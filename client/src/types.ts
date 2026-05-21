
export interface Coordinate {
    lat: number,
    lng: number
}

export interface Guess {
    userId: string,
    guessedCoordinate: Coordinate,
    distanceMeters?: number,
    score?: number,
    country?: string
}

export interface User {
    id: string,
    username: string
}

export interface GeoImage {
    id: string,
    imageUrl: string,
    realCoordinate: Coordinate
}

export interface GameSession {
    roomId: string,
    status: string,
    players: User[],
    guesses: Guess[]
}