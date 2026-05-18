import { whoAmI } from "../utils/backApi"

export const Play = ()=>{
    whoAmI();
    return(
        <div>
            <h1>Play</h1>
        </div>
    )
}
