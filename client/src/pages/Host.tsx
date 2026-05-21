import { useEffect, useState } from "react"
import type { LatLngExpression } from "leaflet"
import socket from "../utils/socket"
import Map from "../components/map/Map"
import AppHeader from "../components/appHeader/AppHeader"
import type { Guess, RoundResult, User } from "../types"
import styles from "./Host.module.css"

const WORLD_CENTER: LatLngExpression = [20, 0]

type Stage = "not-started" | "lobby" | "playing" | "reveal"

export const Host = () => {
    const [stage, setStage] = useState<Stage>("not-started")
    const [gameCode, setGameCode] = useState("")
    const [players, setPlayers] = useState<User[]>([])
    const [imageUrl, setImageUrl] = useState("")
    const [round, setRound] = useState(0)
    const [endsAt, setEndsAt] = useState(0)
    const [secondsLeft, setSecondsLeft] = useState(0)
    const [guesses, setGuesses] = useState<Guess[]>([])
    const [result, setResult] = useState<RoundResult | null>(null)

    useEffect(() => {
        const onGameCode = (code: string) => {
            setGameCode(code)
            setStage("lobby")
        }
        const onPlayersList = (list: User[]) => setPlayers(list)
        const onRoundStarted = (data: { imageUrl: string, endsAt: number, round: number }) => {
            setImageUrl(data.imageUrl)
            setEndsAt(data.endsAt)
            setRound(data.round)
            setGuesses([])
            setResult(null)
            setStage("playing")
        }
        const onGuessesUpdated = (list: Guess[]) => setGuesses(list)
        const onRoundEnded = (data: RoundResult) => {
            setResult(data)
            setGuesses(data.guesses)
            setStage("reveal")
        }

        socket.on("gameCode", onGameCode)
        socket.on("playersList", onPlayersList)
        socket.on("roundStarted", onRoundStarted)
        socket.on("guessesUpdated", onGuessesUpdated)
        socket.on("roundEnded", onRoundEnded)
        return () => {
            socket.off("gameCode", onGameCode)
            socket.off("playersList", onPlayersList)
            socket.off("roundStarted", onRoundStarted)
            socket.off("guessesUpdated", onGuessesUpdated)
            socket.off("roundEnded", onRoundEnded)
        }
    }, [])

    useEffect(() => {
        if (stage !== "playing") return
        const tick = () => setSecondsLeft(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)))
        tick()
        const id = setInterval(tick, 250)
        return () => clearInterval(id)
    }, [stage, endsAt])

    const handleStartGame = () => socket.emit("startGame")
    const handleStartRound = () => socket.emit("startRound", { gameCode })
    const handleEndGame = () => {
        socket.emit("endGame", { gameCode })
        setStage("not-started")
        setGameCode("")
        setPlayers([])
    }

    if (stage === "not-started") {
        return (
            <div className="page">
                <AppHeader />
                <main className="card">
                    <h1>Panel del Host</h1>
                    <p>Crea una partida y comparte el código con los jugadores.</p>
                    <button className="btn" onClick={handleStartGame}>Nueva partida</button>
                </main>
            </div>
        )
    }

    if (stage === "lobby") {
        return (
            <div className="page">
                <AppHeader />
                <main className="card">
                    <h1>Sala de espera</h1>
                    <p>Código de partida:</p>
                    <p className="game-code">{gameCode}</p>
                    <h2>Jugadores ({players.length})</h2>
                    <ul className="player-list">
                        {players.map((player) => <li key={player.id}>{player.username}</li>)}
                    </ul>
                    <button className="btn" onClick={handleStartRound} disabled={players.length === 0}>
                        Iniciar ronda
                    </button>
                </main>
            </div>
        )
    }

    const isReveal = stage === "reveal"

    return (
        <div className="page">
            <AppHeader />
            <main className="game">
                <div className="game-bar">
                    <span>Ronda {round} · Código {gameCode}</span>
                    {isReveal
                        ? <span>{guesses.length} marcas</span>
                        : <span className={secondsLeft <= 5 ? "timer urgent" : "timer"}>{secondsLeft}s</span>}
                </div>
                {isReveal && result && (
                    <p className="hint">
                        {result.winnerUsername
                            ? `🏆 Ganador: ${result.winnerUsername}`
                            : "Nadie marcó a tiempo"}
                    </p>
                )}
                <section className={styles.hostScreen}>
                    <img className="geo-image" src={imageUrl} alt="Imagen de la ronda" />
                    <Map
                        center={isReveal && result ? result.realCoordinate : WORLD_CENTER}
                        zoom={isReveal ? 3 : 2}
                        guesses={guesses}
                        realCoordinate={isReveal && result ? result.realCoordinate : null}
                        winnerId={isReveal && result ? result.winnerId : null}
                    />
                </section>
                {isReveal && (
                    <div className="host-actions">
                        <button className="btn" onClick={handleStartRound}>Siguiente ronda</button>
                        <button className="btn btn-secondary" onClick={handleEndGame}>Terminar partida</button>
                    </div>
                )}
            </main>
        </div>
    )
}
