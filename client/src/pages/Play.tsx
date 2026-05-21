import {useState} from "react"
import { io } from "socket.io-client"

const socket  = io(import.meta.env.VITE_BACKEND_URL);

export const Play = ()=>{
    const [gameState] = useState("not-started");

    const handleSubmit = (data:FormData)=>{
        socket.emit("joinGame",{
            gameCode: data.get("gameCode"),
            username: data.get("name")
        });
    }
    if(gameState === "not-started"){
        return(
            <div>
                <h1>Unirse a partida</h1>
                <form action={handleSubmit}>
                    <input type="text" name="name" placeholder="Nombre"/>
                    <input type="text" name="gameCode" placeholder="Codigo de partida"/>
                    <button type="submit">Unirse</button>
                </form>
            </div>
        )
    }
    return(
        <div>
            <h1>Play</h1>
        </div>
    )
}
