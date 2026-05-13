import { NavLink } from "react-router";

const AppHeader = () => {
    return (
        <header className="appHeader">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/play">Play</NavLink>
                    </li>
                    <li>
                        <NavLink to="/host">Host</NavLink>
                    </li>
                    <li>
                        <NavLink to="/auth">Auth</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;