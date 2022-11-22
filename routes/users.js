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
        } else if (error.code === "ERR_INVALID_ARG_TYPE") {
            res.status(400).json({
                status: "error",
                message: "Request is invalid",
            });
        }
    }
});

router.get("/", async (req, res, next) => {
    try {
        if (await user.doesExist(req.body.username, req.body.password)) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const jwt = await new jose.SignJWT({})
                .setProtectedHeader({
                    alg: "HS256",
                })
                .setIssuer(req.headers.referer)
                .setAudience(req.body.username)
                .setIssuedAt()
                .setExpirationTime("1d")
                .sign(secret);

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
    } catch (error) {
        if (error.code === "ERR_INVALID_ARG_TYPE") {
            res.status(400).json({
                status: "error",
                message: "Request is invalid",
            });
        }
    }
});

module.exports = router;
