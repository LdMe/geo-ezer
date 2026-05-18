import { createBrowserRouter, redirect } from "react-router";
import { Host, Play, Root, Auth } from "./pages";
import { whoAmI } from "./utils/backApi";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        loader: async () => {
            const result = await whoAmI();
            if (result.error) {
                return redirect("/auth")
            }
            return result
        },
        children: [
            {
                path: "/play",
                element: <Play />
            },
            {
                path: "/host",
                element: <Host />
            },

        ]
    },
    {
        path: "/auth",
        element: <Auth />
    }
]);

export default router