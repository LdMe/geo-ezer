import { Outlet } from "react-router"
export const Root =()=>{
    return(
        <div>
            <h1>Root</h1>
            <Outlet/>
        </div>
    )
}
