const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {

    const token =
        req.cookies.token ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await userModel.findById(decoded.userId);

        req.user = user;

        return next();

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access, token is not verified",
        });
    }
};
const authSystemUserMiddleware = async (req, res, next) => {

    const token =
        req.cookies.token ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await userModel
            .findById(decoded.userId)
            .select("+systemUser");

        console.log("USER:", user);
        console.log("SYSTEM USER:", user?.systemUser);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, not a system user",
            });
        }

        req.user = user;

        return next();

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access, token is not verified",
        });
    }
};
module.exports={
   authMiddleware,authSystemUserMiddleware
}