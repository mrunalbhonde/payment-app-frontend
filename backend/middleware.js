const JWT_SECRET = require("./config");
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startWith("Bearer")){
        return res.status().json({

        })
    }

    token = authHeader.split("")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;

    } catch (err) {
        return res.status(403).json({});
    }

};

module.exports({
    authMiddleware
})