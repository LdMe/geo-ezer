import type { LatLngExpression } from "leaflet";
import { useState } from "react";
import Map from "../components/map/Map"
import type { Guess } from "../types";
import { getCountryFromCoordinates } from "../utils/geoAPI";
import styles from "./Host.module.css"

const defaultGuesses: Guess[] = [
    {
        guessedCoordinate: {
            lat: 43.268673, // Cerca del Museo Guggenheim
            lng: -2.934007
        },
        userId: "1"
    },
    {
        guessedCoordinate: {
            lat: 43.257123, // Zona del Casco Viejo
            lng: -2.923451
        },
        userId: "2"
    },
    {
        guessedCoordinate: {
            lat: 43.264165, // Cerca del estadio San Mamés
            lng: -2.949312
        },
        userId: "3"
    },
    {
        guessedCoordinate: {
            lat: 43.273291, // Mirador de Artxanda (¡alguien se fue a la montaña!)
            lng: -2.930514
        },
        userId: "4"
    },
    {
        guessedCoordinate: {
            lat: 43.323145, // Puente Colgante en Portugalete (bastante desviado)
            lng: -3.017482
        },
        userId: "5"
    },
    {
        guessedCoordinate: {
            lat: 43.263110, // Indautxu / Centro
            lng: -2.937222
        },
        userId: "6"
    },
    {
        guessedCoordinate: {
            lat: 40.416775, // Madrid (El jugador que no tiene ni idea de dónde está)
            lng: -3.703790
        },
        userId: "7"
    }
];
export const Host = () => {
    const center: LatLngExpression = [43.25562168899, -2.92255995942725];
    const [guesses, setGuesses] = useState(defaultGuesses);

    const handleAddGuess = async (lat: number, lng: number) => {
        const country = await getCountryFromCoordinates(lat, lng);
        const newGuess: Guess = {
            guessedCoordinate: {
                lat: lat,
                lng: lng
            },
            userId: "8",
            country: country
        }

        setGuesses([...guesses, newGuess])
    }
    return (
        <div>
            <h1>Host</h1>
            <section className={styles.hostScreen}>
                <img className="geoImage" src="https://vajiramias.sgp1.cdn.digitaloceanspaces.com/wp/current-affairs/2025/04/tropical_forests.webp" alt="" />
                <Map center={center} guesses={guesses} onGuess={handleAddGuess} />
            </section>
        </div>
    )
}
