# Geo Ezer

Juego multijugador estilo *GeoGuessr* para jugar en clase. El **host** muestra una
imagen y los **jugadores** marcan en un mapa dónde creen que fue tomada. Cuando se
acaba el tiempo se revela la posición real y gana quien más se haya acercado.

## Cómo funciona

- El **host** se registra / inicia sesión y crea una partida. Recibe un **código** de 6 caracteres.
- Los **jugadores** entran sin registrarse: solo escriben un nombre y el código de la partida.
- Al iniciar una ronda, todos ven la misma imagen y un mapa del mundo.
- Cada jugador hace clic en el mapa para colocar su marca. Puede **moverla** las veces
  que quiera mientras quede tiempo (cuenta atrás de 30 s).
- El host ve **en tiempo real** todas las marcas de los jugadores.
- Al terminar el tiempo se revela la posición real, se calcula la distancia de cada
  jugador (fórmula de Haversine) y se pinta una **línea entre la posición real y la
  marca ganadora**.
- El host puede lanzar la **siguiente ronda** o terminar la partida.

## Stack

| Parte    | Tecnología |
|----------|------------|
| Cliente  | React 19, React Router 7, Vite, Leaflet / React-Leaflet, socket.io-client |
| Servidor | Node.js, Express 5, Socket.IO, Mongoose |
| Base de datos | MongoDB (solo para las cuentas de host) |
| Tiempo real | Socket.IO (lobby, rondas, marcas, resultados) |

## Estructura del proyecto

```
geo-ezer/
├── client/                 # Frontend (React + Vite)
│   └── src/
│       ├── pages/           # Root, Auth, Host, Play
│       ├── components/      # AppHeader, Map
│       └── utils/           # socket.io y llamadas al backend
└── server/                 # Backend (Express + Socket.IO)
    ├── docker-compose.yml   # App + MongoDB
    └── src/
        ├── sockets.js       # Lógica del juego (rondas, marcas, ganador)
        ├── controllers/     # Autenticación del host
        └── models/          # Modelo de usuario
```

## Requisitos

- Node.js 20.19+ (o 22.12+)
- Docker y Docker Compose (para el servidor y MongoDB)

## Puesta en marcha

### 1. Servidor (Express + MongoDB con Docker)

```bash
cd server
cp .env.example .env      # ajusta los valores si lo necesitas
docker compose up --build
```

Esto levanta dos contenedores: la API en `http://localhost:3001` y MongoDB.

> Si el puerto **3001** ya está en uso, cambia `APP_PORT` en `server/.env`
> (y `VITE_BACKEND_URL` en `client/.env` para que coincida).

### 2. Cliente (React + Vite)

```bash
cd client
cp .env.example .env      # VITE_BACKEND_URL debe apuntar al servidor
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Variables de entorno

**`server/.env`**

| Variable | Descripción |
|----------|-------------|
| `APP_PORT` | Puerto público de la API |
| `MONGO_USER` / `MONGO_PASSWORD` / `MONGO_DB` | Credenciales de MongoDB |
| `MONGO_PORT` | Puerto público de MongoDB |
| `JWT_SECRET` | Secreto para firmar los tokens del host |

**`client/.env`**

| Variable | Descripción |
|----------|-------------|
| `VITE_BACKEND_URL` | URL del servidor (debe coincidir con `APP_PORT`) |

## Cómo jugar

1. Abre `http://localhost:5173`.
2. **Host:** entra en *Crear partida*, regístrate o inicia sesión, pulsa **Nueva
   partida** y comparte el código que aparece.
3. **Jugadores:** entran en *Jugar*, escriben su nombre y el código, y pulsan **Unirse**.
4. El host pulsa **Iniciar ronda**. Los jugadores marcan su posición en el mapa.
5. Al acabar el tiempo se revela la posición real y el ganador.
6. El host puede lanzar más rondas o terminar la partida.
