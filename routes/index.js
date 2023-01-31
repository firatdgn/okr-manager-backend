const express = require("express");
const router = express.Router();
const jose = require("jose");

router.get("/", function (req, res, next) {
    res.send("Hello World");
});

router.post("/is-token-valid", async (req, res) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    try {
        const { payload, protectedHeader } = await jose.jwtVerify(
            req.body["access-token"],
            secret
        );
        if (payload) {
            res.json({
                status: "success",
                message: "Token is valid.",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Token is not valid.",
        });
    }
});

module.exports = router;
