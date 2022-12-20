const express = require("express");
const bhag = require("../models/bhag");
const quarterRouter = require("./quarters");
const redisClient = require("../core/redis-cli");
const dbEvents = require("../events/db-events");

const router = express.Router();

router.get("/", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    let bhags = redisClient.get(`${payload.aud}:bhag`, async (err, reply) => {
        if (reply) {
            bhags = JSON.parse(reply);
        } else {
            bhags = await bhag.getAll({ user: payload.aud });
            dbEvents.emit("okrIsChanged", payload.aud);
        }
        res.status(200).json(bhags);
    });
});
router.patch("/clear-cache", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const bhags = await bhag.getAll({ user: payload.aud });
    dbEvents.emit("okrIsChanged", payload.aud);
    res.status(200).json(bhags);
});
router.post("/", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await bhag.create(req.body.bhagContent, payload.aud);
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud, () => {
            res.status(201).json({
                status: "success",
                message: "BHAG is created",
            });
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't create the BHAG",
        });
    }
});
router.put("/:id", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await bhag.update(
        req.body.bhagContent,
        payload.aud,
        req.params.id
    );
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud, () => {
            res.status(201).json({
                status: "success",
                message: "BHAG is updated",
            });
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't update the BHAG",
        });
    }
});

router.delete("/:id", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await bhag.delete(payload.aud, req.params.id);
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud, () => {
            res.status(200).json({
                status: "success",
                message: "BHAG is deleted",
            });
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't delete the BHAG",
        });
    }
});

router.use("/:bhagId/quarters", quarterRouter);

module.exports = router;
