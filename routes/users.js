const express = require("express");
const user = require("../models/user");
const jose = require("jose");
const redis = require("../core/redis-cli");

const router = express.Router();

router.post("/", async (req, res, next) => {
    let result;
    try {
        result = await user.create(req.body.username, req.body.password);
        if (result.affectedRows > 0) {
            res.status(201).json({
                status: "success",
                message: "The user is created",
            });
        }
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                status: "error",
                message: "The user name is already created.",
            });
        }
    }
});

router.get("/", async (req, res, next) => {
    if (await user.doesExist(req.body.username, req.body.password)) {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const jwt = await new jose.SignJWT({})
            .setProtectedHeader({
                alg: "HS256",
            })
            .setIssuer(req.headers.referer)
            .setAudience(req.body.username)
            .setExpirationTime("1h")
            .setIssuedAt()
            .sign(secret);

        redis.set(`jwt:user:${req.body.username}`, jwt, "EX", 60 * 60);

        res.status(200).json({
            status: "success",
            data: jwt,
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "User does not exist",
        });
    }
});

module.exports = router;
