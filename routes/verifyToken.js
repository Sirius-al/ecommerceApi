const jwt = require("jsonwebtoken");

const veriftToken = (req, res, next) => {
    const authHeader = req.headers.token;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401).json({ message: "You are not authorized!" });

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err)
            return res.sendStatus(403).json({ message: "Token is not valid!" });
        req.user = user;
        next();
    });
};

const verifyTokenAndAuthorization = (req, res, next) => {
    veriftToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.sendStatus(403).json({ message: "You are not authorized!" });
        }
    });
};

module.exports = { veriftToken, verifyTokenAndAuthorization };
