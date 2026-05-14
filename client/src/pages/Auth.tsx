import { useSearchParams } from "react-router"
import {register,login} from "../utils/backApi"
import useLocalStorage from "../hooks/useLocalStorage"

export const Auth = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const [token, setToken] = useLocalStorage("token", null)
    const isRegister = searchParams.get("register") === "true"
    const handleRegister = async (data: FormData) => {
        const result = await register({
            username: data.get("name") as string,
            password: data.get("password") as string,
            passwordRepeat: data.get("passwordRepeat") as string
        });
        console.log(result);
    }
    const handleLogin = async(data: FormData) => {
        const result = await login({
            username: data.get("name") as string,
            password: data.get("password") as string,
        })
        console.log(result);
        if(result.token){
            setToken(result.token);
        }
    }
    const handleSearchParams = ()=>{
        if(isRegister){
            setSearchParams({register: "false"})
        }else{
            setSearchParams({
                register: "true"
            })
        }
        
    }
    return (
        <div>
            <h1>{isRegister ? "Register" : "Login"}</h1>
            <form action={isRegister ? handleRegister : handleLogin}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" />
                {isRegister && (
                    <>
                        <label htmlFor="passwordRepeat">Confirm Password </label>
                        <input type="password" id="passwordRepeat" name="passwordRepeat"/>
                    </>
                )}
                <button type="submit">{isRegister ? "Register" : "Login"}</button>
            </form>
           <button onClick={handleSearchParams}>{isRegister ? "Login" : "Register"}</button>
        </div>
    )
}
