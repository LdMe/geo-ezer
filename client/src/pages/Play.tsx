import { useState, useEffect } from "react"
import type { LatLngExpression } from "leaflet"
import socket from "../utils/socket"
import Map, { formatDistance } from "../components/map/Map"
import AppHeader from "../components/appHeader/AppHeader"
import type { Coordinate, Guess, RoundResult } from "../types"

const WORLD_CENTER: LatLngExpression = [20, 0]

type Stage = "join" | "lobby" | "playing" | "reveal"

export const Play = () => {
    const [stage, setStage] = useState<Stage>("join")
    const [gameCode, setGameCode] = useState("")
    const [error, setError] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [round, setRound] = useState(0)
    const [endsAt, setEndsAt] = useState(0)
    const [secondsLeft, setSecondsLeft] = useState(0)
    const [myGuess, setMyGuess] = useState<Coordinate | null>(null)
    const [result, setResult] = useState<RoundResult | null>(null)

    useEffect(() => {
        const onJoined = ({ gameCode }: { gameCode: string }) => {
            setGameCode(gameCode)
            setError("")
            setStage("lobby")
        }
        const onBadCode = (msg: string) => setError(msg)
        const onRoundStarted = (data: { imageUrl: string, endsAt: number, round: number }) => {
            setImageUrl(data.imageUrl)
            setEndsAt(data.endsAt)
            setRound(data.round)
            setMyGuess(null)
            setResult(null)
            setStage("playing")
        }
        const onRoundEnded = (data: RoundResult) => {
            setResult(data)
            setStage("reveal")
        }
        const onGameClosed = () => {
            setStage("join")
            setGameCode("")
            setError("La partida ha terminado")
        }

        socket.on("joinedGame", onJoined)
        socket.on("incorrectGameCode", onBadCode)
        socket.on("roundStarted", onRoundStarted)
        socket.on("roundEnded", onRoundEnded)
        socket.on("gameClosed", onGameClosed)
        return () => {
            socket.off("joinedGame", onJoined)
            socket.off("incorrectGameCode", onBadCode)
            socket.off("roundStarted", onRoundStarted)
            socket.off("roundEnded", onRoundEnded)
            socket.off("gameClosed", onGameClosed)
        }
    }, [])

    useEffect(() => {
        if (stage !== "playing") return
        const tick = () => setSecondsLeft(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)))
        tick()
        const id = setInterval(tick, 250)
        return () => clearInterval(id)
    }, [stage, endsAt])

    const handleJoin = (data: FormData) => {
        setError("")
        socket.emit("joinGame", {
            gameCode: (data.get("gameCode") as string).toUpperCase().trim(),
            username: (data.get("name") as string).trim()
        })
    }

    const handleGuess = (lat: number, lng: number) => {
        if (stage !== "playing" || secondsLeft <= 0) return
        const coordinate: Coordinate = { lat, lng }
        setMyGuess(coordinate)
        socket.emit("submitGuess", { gameCode, coordinate })
    }

    if (stage === "join") {
        return (
            <div className="page">
                <AppHeader />
                <main className="card">
                    <h1>Unirse a una partida</h1>
                    <form action={handleJoin} className="form">
                        <label htmlFor="name">Tu nombre</label>
                        <input type="text" id="name" name="name" placeholder="Nombre" required />
                        <label htmlFor="gameCode">Código de partida</label>
                        <input type="text" id="gameCode" name="gameCode" placeholder="ABC123" required />
                        <button className="btn" type="submit">Unirse</button>
                    </form>
                    {error && <p className="message error">{error}</p>}
                </main>
            </div>
        )
    }

    if (stage === "lobby") {
        return (
            <div className="page">
                <AppHeader />
                <main className="card">
                    <h1>Estás dentro</h1>
                    <p>Código de partida: <strong>{gameCode}</strong></p>
                    <p>Esperando a que el host inicie la ronda...</p>
                </main>
            </div>
        )
    }

    if (stage === "playing") {
        return (
            <div className="page">
                <AppHeader />
                <main className="game">
                    <div className="game-bar">
                        <span>Ronda {round}</span>
                        <span className={secondsLeft <= 5 ? "timer urgent" : "timer"}>{secondsLeft}s</span>
                    </div>
                    <p className="hint">
                        {myGuess ? "Puedes mover tu marca mientras quede tiempo." : "Haz clic en el mapa para marcar dónde crees que es."}
                    </p>
                    <div className="game-layout">
                        <img className="geo-image" src={imageUrl} alt="¿Dónde es esto?" />
                        <Map
                            center={WORLD_CENTER}
                            guesses={myGuess ? [{ userId: "me", username: "Tú", guessedCoordinate: myGuess }] : []}
                            onGuess={handleGuess}
                        />
                    </div>
                </main>
            </div>
        )
    }

    // reveal
    const myResult = result?.guesses.find((g: Guess) => g.userId === socket.id)
    const iWon = result?.winnerId === socket.id

    return (
        <div className="page">
            <AppHeader />
            <main className="game">
                <div className="game-bar">
                    <span>Ronda {round} terminada</span>
                </div>
                {result && (
                    <>
                        <p className="hint">
                            {iWon
                                ? "🏆 ¡Has ganado esta ronda!"
                                : result.winnerUsername
                                    ? `Ganador: ${result.winnerUsername}`
                                    : "Nadie marcó a tiempo"}
                            {myResult && ` · Tu marca quedó a ${formatDistance(myResult.distanceMeters!)}`}
                        </p>
                        <Map
                            center={result.realCoordinate}
                            zoom={3}
                            guesses={result.guesses}
                            realCoordinate={result.realCoordinate}
                            winnerId={result.winnerId}
                        />
                    </>
                )}
                <p className="hint">Esperando la siguiente ronda...</p>
            </main>
        </div>
    )
}
