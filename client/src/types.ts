
export interface Coordinate {
    lat: number,
    lng: number
}

export interface Guess {
    userId: string,
    username?: string,
    guessedCoordinate: Coordinate,
    distanceMeters?: number,
    score?: number,
    country?: string
}

export interface User {
    id: string,
    username: string
}

export interface RoundResult {
    realCoordinate: Coordinate,
    guesses: Guess[],
    winnerId: string | null,
    winnerUsername: string | null
}
