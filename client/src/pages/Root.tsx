import { Link } from "react-router"
import AppHeader from "../components/appHeader/AppHeader"

export const Root = () => {
    return (
        <div className="page">
            <AppHeader />
            <main className="landing">
                <h1>Geo Ezer</h1>
                <p>Mira la foto y adivina en el mapa dónde se hizo. ¡Gana quien más se acerque!</p>
                <div className="landing-actions">
                    <Link className="btn" to="/play">Jugar</Link>
                    <Link className="btn btn-secondary" to="/host">Crear partida (Host)</Link>
                </div>
            </main>
        </div>
    )
}
