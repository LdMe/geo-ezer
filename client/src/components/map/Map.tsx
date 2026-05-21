import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import type { LatLngExpression, LeafletMouseEvent } from "leaflet";
import type { Coordinate, Guess } from "../../types";

export function formatDistance(meters: number) {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${meters} m`;
}

interface MapProps {
    center: LatLngExpression,
    zoom?: number,
    guesses?: Guess[],
    realCoordinate?: Coordinate | null,
    winnerId?: string | null,
    onGuess?: (lat: number, lng: number) => void
}

const Map = ({ center, zoom = 2, guesses = [], realCoordinate, winnerId, onGuess }: MapProps) => {
    const winnerGuess = guesses.find((g) => g.userId === winnerId);

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="map">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {onGuess && <MapClickHandler onMapClick={onGuess} />}

            {guesses.map((guess) => {
                const isWinner = guess.userId === winnerId;
                const color = isWinner ? "#16a34a" : "#2563eb";
                return (
                    <CircleMarker
                        key={guess.userId}
                        center={guess.guessedCoordinate}
                        radius={isWinner ? 11 : 8}
                        pathOptions={{ color, fillColor: color, fillOpacity: 0.85 }}
                    >
                        <Popup>
                            <strong>{guess.username || guess.userId}</strong>
                            {guess.distanceMeters != null && (
                                <div>A {formatDistance(guess.distanceMeters)}</div>
                            )}
                            {isWinner && <div>🏆 ¡Ganador!</div>}
                        </Popup>
                    </CircleMarker>
                );
            })}

            {realCoordinate && (
                <CircleMarker
                    center={realCoordinate}
                    radius={12}
                    pathOptions={{ color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.9 }}
                >
                    <Popup>Posición real</Popup>
                </CircleMarker>
            )}

            {realCoordinate && winnerGuess && (
                <Polyline
                    positions={[realCoordinate, winnerGuess.guessedCoordinate]}
                    pathOptions={{ color: "#16a34a", weight: 3, dashArray: "6" }}
                />
            )}
        </MapContainer>
    );
};

interface MapClickHandlerProps {
    onMapClick: (lat: number, lng: number) => void
}

const MapClickHandler = ({ onMapClick }: MapClickHandlerProps) => {
    useMapEvents({
        click: (e: LeafletMouseEvent) => onMapClick(e.latlng.lat, e.latlng.lng)
    });
    return null;
};

export default Map;
