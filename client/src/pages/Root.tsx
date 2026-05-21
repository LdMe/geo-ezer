import { Outlet } from "react-router"
import AppHeader from "../components/appHeader/AppHeader"
export const Root =()=>{
    return(
        <div>
            <AppHeader/>
            <h1>Root</h1>
            <Outlet/>
        </div>
    )
}
