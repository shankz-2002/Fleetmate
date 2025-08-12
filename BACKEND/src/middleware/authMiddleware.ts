import jwt from "jsonwebtoken";
export const isAuthenticated = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, "accessToken", (err: any, user: any) => {
        if (err) return res.status(403).json({ msg: err });
        req.user = user;
        next();

    })
}



