const jwt = require("jsonwebtoken");

module.exports = function auth(req,res,next) {
    try{
        const authHeader = req.headers.authorization; // Bearer <token>
        const token = authHeader?.split("")[1];

        if(!token) {
            return res.status(401).json({status:"fail", message: "Unauthorized"});  // 토큰 없음
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.userId;

        next();

    }catch(error) {
        return res.status(401).json({status:"fail", message: "Invalid token"});  // 유효하지 않은 토큰
    }
};