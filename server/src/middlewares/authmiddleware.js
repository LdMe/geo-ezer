import jwt from "jsonwebtoken";
// middleware para añadir en req.user el usuario a partir del token jwt
// const authMiddleware = (req, res, next) => {
//     const token = req.headers.authorization;
//     if (!token) {
//         return res.status(401).json({ error: "No token provided" });
//     }
//     try {
//         const cleanToken = token.replace("Bearer ", "");
//         const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({ error: "Invalid token" });
//     }
// };

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export default authMiddleware;