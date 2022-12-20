const express = require("express");
const keyResult = require("../models/key-result");
const crfRouter = require("./crfs");
const dbEvents = require("../events/db-events");

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    try {
        const result = await keyResult.create(
            req.body.keyResultContent,
            req.body.keyResultRequiredStatus,
            req.params.objectiveId,
            payload.aud
        );
        if (result.affectedRows > 0) {
            dbEvents.emit("okrIsChanged", payload.aud, () => {
                res.status(201).json({
                    status: "success",
                    message: "Key result is created",
                });
            });
        } else {
            res.status(400).json({
                status: "error",
                message: "Couldn't create the key result",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Couldn't create the key result",
        });
    }
});
router.put("/:keyResultId", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await keyResult.update(
        req.body.keyResultContent,
        req.body.keyResultRequiredStatus,
        req.params.keyResultId,
        payload.aud
    );
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud, () => {
            res.status(201).json({
                status: "success",
                message: "Key result is updated",
            });
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't update the key result",
        });
    }
});

router.delete("/:keyResultId", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await keyResult.delete(payload.aud, req.params.keyResultId);
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud, () => {
            res.status(200).json({
                status: "success",
                message: "Key result is deleted",
            });
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't delete the key result",
        });
    }
});

router.use("/:keyResultId/crfs", crfRouter);

module.exports = router;
