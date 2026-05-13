import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "./Map.css"
import type { LatLngExpression } from "leaflet";
import type { Guess } from "../../types";

interface MapProps {
    center: LatLngExpression,
    zoom?: number,
    guesses?: Guess[],
    onGuess?: (lat: number, lng: number) => void
}
const Map = ({ center, zoom = 10, guesses,onGuess }: MapProps) => {

    return (
        <div>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="map">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={onGuess} />
                {guesses?.map(guess => (
                    <Marker position={guess.guessedCoordinate} key={guess.userId}>
                        <Popup>
                            <h3>
                            {guess.userId}
                            </h3>
                            <p>Pais: {guess.country}</p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

        </div>
    )
}

interface MapClickHAndlerProps {
    onMapClick: (lat: number, lng: number) => void
}
const MapClickHandler = ({ onMapClick }: MapClickHAndlerProps) => {
    const handleMapClick = (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng)
    }
    useMapEvents({
        click: handleMapClick
    })

    return null;
}

export default Map;