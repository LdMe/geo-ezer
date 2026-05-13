import { createBrowserRouter } from "react-router";
import {Host, Play, Root,Auth} from "./pages";
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
            },
            {
                path: "/auth",
                element: <Auth />
            }
        ]
    },
]);

export default router