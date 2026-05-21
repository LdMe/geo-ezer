import { createBrowserRouter, redirect } from "react-router";
import { Host, Play, Root, Auth } from "./pages";
import { whoAmI } from "./utils/backApi";

const requireAuth = async () => {
    const result = await whoAmI();
    if (result.error) {
        return redirect("/auth");
    }
    return result;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />
    },
    {
        path: "/play",
        element: <Play />
    },
    {
        path: "/host",
        element: <Host />,
        loader: requireAuth
    },
    {
        path: "/auth",
        element: <Auth />
    }
]);

export default router;
