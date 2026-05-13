import { createBrowserRouter } from "react-router";
import {Host, Play, Root} from "./pages";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children:[
            {
                path: "/play",
                element: <Play/>
            },
            {
                path: "/host",
                element: <Host/>
            }
        ]
    },
]);

export default router