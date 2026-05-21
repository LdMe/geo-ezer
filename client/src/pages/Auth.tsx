import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { register, login } from "../utils/backApi"
import AppHeader from "../components/appHeader/AppHeader"

export const Auth = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const [message, setMessage] = useState("")
    const isRegister = searchParams.get("register") === "true"

    const handleRegister = async (data: FormData) => {
        const result = await register({
            username: data.get("name") as string,
            password: data.get("password") as string,
            passwordRepeat: data.get("passwordRepeat") as string
        })
        if (result.error) {
            setMessage(typeof result.error === "string" ? result.error : "Error de registro")
        } else {
            setMessage("Usuario creado, ya puedes iniciar sesión")
            setSearchParams({ register: "false" })
        }
    }

    const handleLogin = async (data: FormData) => {
        const result = await login({
            username: data.get("name") as string,
            password: data.get("password") as string,
        })
        if (result.error) {
            setMessage(typeof result.error === "string" ? result.error : "Credenciales incorrectas")
        } else {
            navigate("/host")
        }
    }

    const handleSearchParams = () => {
        setMessage("")
        setSearchParams({ register: isRegister ? "false" : "true" })
    }

    return (
        <div className="page">
            <AppHeader />
            <main className="card">
                <h1>{isRegister ? "Registro" : "Login"} de Host</h1>
                <form action={isRegister ? handleRegister : handleLogin} className="form">
                    <label htmlFor="name">Nombre</label>
                    <input type="text" id="name" name="name" required />
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password" name="password" required />
                    {isRegister && (
                        <>
                            <label htmlFor="passwordRepeat">Repite la contraseña</label>
                            <input type="password" id="passwordRepeat" name="passwordRepeat" required />
                        </>
                    )}
                    <button className="btn" type="submit">{isRegister ? "Registrarse" : "Entrar"}</button>
                </form>
                {message && <p className="message">{message}</p>}
                <button className="link-btn" onClick={handleSearchParams}>
                    {isRegister ? "Ya tengo cuenta" : "Crear una cuenta"}
                </button>
            </main>
        </div>
    )
}
