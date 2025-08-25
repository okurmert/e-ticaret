import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export function isAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) return next();
    return res.status(403).json({ message: 'Access denied' });
}