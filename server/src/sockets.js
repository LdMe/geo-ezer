
function generateRandomGameCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}

const users = {};
const games = {};

function configureSocket(io) {
    io.on("connection", (socket) => {
        console.log("a user connected")
        socket.on("disconnect", () => {
            const user = users[socket.id];
            if (user) {
                const gameCode = user.gameCode;
                if (games[gameCode]) {
                    const index = games[gameCode].players.findIndex((player) => player.id === socket.id);
                    if (index !== -1) {
                        games[gameCode].players.splice(index, 1);
                        io.to(gameCode).emit("playersList", games[gameCode].players)
                    }
                }
            }
            console.log("user disconnected")
        })
        socket.on("startGame", () => {
            const gameCode = generateRandomGameCode();
            socket.emit("gameCode", gameCode)
            socket.join(gameCode);
            games[gameCode] = {
                status: "lobby",
                players: [],
                guesses: [],
                hostID: socket.id
            }
        })
        socket.on("joinGame", ({ gameCode, username }) => {
            

            console.log("usuario conectado ", username);
            if (!games[gameCode]) {
                return socket.emit("incorrectGameCode", "El codigo de la partida es incorrecto");
            }



            if (games[gameCode].status === "lobby") {
                socket.join(gameCode);
                users[socket.id] = {
                    username,
                    gameCode
                }
                games[gameCode].players.push({
                    id: socket.id,
                    username
                });
                io.to(gameCode).emit("playersList", games[gameCode].players)
            }
        })

    })
}

export default configureSocket