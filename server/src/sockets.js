const ROUND_DURATION = 30; // segundos

const IMAGES = [
    { imageUrl: "https://picsum.photos/id/1015/900/600", realCoordinate: { lat: 43.2630, lng: -2.9350 } },  // Bilbao
    { imageUrl: "https://picsum.photos/id/1036/900/600", realCoordinate: { lat: 48.8566, lng: 2.3522 } },   // Paris
    { imageUrl: "https://picsum.photos/id/1039/900/600", realCoordinate: { lat: 35.6762, lng: 139.6503 } }, // Tokyo
    { imageUrl: "https://picsum.photos/id/1043/900/600", realCoordinate: { lat: 40.7128, lng: -74.0060 } }, // New York
    { imageUrl: "https://picsum.photos/id/1018/900/600", realCoordinate: { lat: -33.8688, lng: 151.2093 } } // Sydney
];

function generateRandomGameCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}

// Distancia en metros entre dos coordenadas (formula de Haversine)
function distanceMeters(a, b) {
    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

const users = {};
const games = {};

function configureSocket(io) {
    function endRound(gameCode) {
        const game = games[gameCode];
        if (!game || !game.currentRound) return;

        if (game.currentRound.timer) {
            clearTimeout(game.currentRound.timer);
            game.currentRound.timer = null;
        }

        const real = game.currentRound.image.realCoordinate;
        const guesses = Object.values(game.currentRound.guesses).map((g) => ({
            userId: g.userId,
            username: g.username,
            guessedCoordinate: g.guessedCoordinate,
            distanceMeters: distanceMeters(g.guessedCoordinate, real)
        }));

        let winner = null;
        for (const g of guesses) {
            if (!winner || g.distanceMeters < winner.distanceMeters) {
                winner = g;
            }
        }

        game.status = "reveal";
        io.to(gameCode).emit("roundEnded", {
            realCoordinate: real,
            guesses,
            winnerId: winner ? winner.userId : null,
            winnerUsername: winner ? winner.username : null
        });
    }

    io.on("connection", (socket) => {
        console.log("a user connected");

        socket.on("disconnect", () => {
            const user = users[socket.id];
            if (user) {
                const game = games[user.gameCode];
                if (game) {
                    const index = game.players.findIndex((player) => player.id === socket.id);
                    if (index !== -1) {
                        game.players.splice(index, 1);
                        io.to(user.gameCode).emit("playersList", game.players);
                    }
                }
                delete users[socket.id];
            }
            // Si se desconecta el host, cerramos la partida
            for (const [code, game] of Object.entries(games)) {
                if (game.hostID === socket.id) {
                    if (game.currentRound && game.currentRound.timer) {
                        clearTimeout(game.currentRound.timer);
                    }
                    io.to(code).emit("gameClosed");
                    delete games[code];
                }
            }
            console.log("user disconnected");
        });

        socket.on("startGame", () => {
            const gameCode = generateRandomGameCode();
            socket.join(gameCode);
            games[gameCode] = {
                status: "lobby",
                players: [],
                hostID: socket.id,
                roundIndex: -1,
                currentRound: null
            };
            socket.emit("gameCode", gameCode);
        });

        socket.on("joinGame", ({ gameCode, username }) => {
            console.log("usuario intentando conectar:", username);
            const game = games[gameCode];
            if (!game) {
                return socket.emit("incorrectGameCode", "El codigo de la partida es incorrecto");
            }
            if (game.status !== "lobby") {
                return socket.emit("incorrectGameCode", "La partida ya ha comenzado");
            }

            socket.join(gameCode);
            users[socket.id] = { username, gameCode };
            game.players.push({ id: socket.id, username });
            socket.emit("joinedGame", { gameCode, playerId: socket.id });
            io.to(gameCode).emit("playersList", game.players);
        });

        socket.on("startRound", ({ gameCode }) => {
            const game = games[gameCode];
            if (!game || game.hostID !== socket.id) return;

            game.roundIndex = (game.roundIndex + 1) % IMAGES.length;
            const image = IMAGES[game.roundIndex];
            const endsAt = Date.now() + ROUND_DURATION * 1000;

            game.status = "playing";
            game.currentRound = {
                image,
                guesses: {},
                endsAt,
                timer: setTimeout(() => endRound(gameCode), ROUND_DURATION * 1000)
            };

            io.to(gameCode).emit("roundStarted", {
                imageUrl: image.imageUrl,
                duration: ROUND_DURATION,
                endsAt,
                round: game.roundIndex + 1
            });
        });

        socket.on("submitGuess", ({ gameCode, coordinate }) => {
            const game = games[gameCode];
            if (!game || game.status !== "playing" || !game.currentRound) return;
            if (Date.now() > game.currentRound.endsAt) return;

            const user = users[socket.id];
            if (!user) return;

            game.currentRound.guesses[socket.id] = {
                userId: socket.id,
                username: user.username,
                guessedCoordinate: coordinate
            };

            // El host ve todos los puntos marcados en tiempo real
            io.to(game.hostID).emit("guessesUpdated", Object.values(game.currentRound.guesses));
        });

        socket.on("endGame", ({ gameCode }) => {
            const game = games[gameCode];
            if (!game || game.hostID !== socket.id) return;
            if (game.currentRound && game.currentRound.timer) {
                clearTimeout(game.currentRound.timer);
            }
            io.to(gameCode).emit("gameClosed");
            delete games[gameCode];
        });
    });
}

export default configureSocket;
