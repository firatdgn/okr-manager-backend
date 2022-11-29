const express = require("express");
const quarter = require("../models/quarter");
const objectiveRouter = require("./objectives");
const dbEvents = require("../events/db-events");

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    try {
        const result = await quarter.create(
            req.body.startedAt,
            req.body.finishedAt,
            req.params.bhagId,
            payload.aud
        );
        if (result.affectedRows > 0) {
            dbEvents.emit("okrIsChanged", payload.aud);
            res.status(201).json({
                status: "success",
                message: "Quarter is created",
            });
        } else {
            res.status(400).json({
                status: "error",
                message: "Couldn't create the quarter",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Couldn't create the quarter",
        });
    }
});
router.put("/:quarterId", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await quarter.update(
        req.body.startedAt,
        req.body.finishedAt,
        req.params.quarterId,
        payload.aud
    );
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud);
        res.status(201).json({
            status: "success",
            message: "Quarter is updated",
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't update the quarter",
        });
    }
});

router.delete("/:quarterId", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await quarter.delete(payload.aud, req.params.quarterId);
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud);
        res.status(200).json({
            status: "success",
            message: "Quarter is deleted",
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't delete the quarter",
        });
    }
});

router.use("/:quarterId/objectives", objectiveRouter);

module.exports = router;
