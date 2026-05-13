import { useSearchParams } from "react-router"
export const Auth = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const isRegister = searchParams.get("register") === "true"
    const handleRegister = (data: FormData) => {

    }
    const handleLogin = (data: FormData) => {

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
                        <label htmlFor="password-confirm">Confirm Password </label>
                        <input type="password" id="password-confirm" />
                    </>
                )}
                <button type="submit">{isRegister ? "Register" : "Login"}</button>
            </form>
           <button onClick={handleSearchParams}>{isRegister ? "Login" : "Register"}</button>
        </div>
    )
}
