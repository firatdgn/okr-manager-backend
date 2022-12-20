const express = require("express");
const objective = require("../models/objective");
const keyResultRouter = require("./key-results");
const dbEvents = require("../events/db-events");

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    try {
        const result = await objective.create(
            req.body.objectiveContent,
            req.params.quarterId,
            payload.aud
        );
        if (result.affectedRows > 0) {
            dbEvents.emit("okrIsChanged", payload.aud, () => {
                res.status(201).json({
                    status: "success",
                    message: "Objective is created",
                });
            });
        } else {
            res.status(400).json({
                status: "error",
                message: "Couldn't create the objective",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Couldn't create the objective",
        });
    }
});
router.put("/:objectiveId", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await objective.update(
        req.body.objectiveContent,
        req.params.objectiveId,
        payload.aud
    );
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud, () => {
            res.status(201).json({
                status: "success",
                message: "Objective is updated",
            });
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't update the objective",
        });
    }
});

router.delete("/:objectiveId", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await objective.delete(payload.aud, req.params.objectiveId);
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud, () => {
            res.status(200).json({
                status: "success",
                message: "Objective is deleted",
            });
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't delete the objective",
        });
    }
});

router.use("/:objectiveId/key-results", keyResultRouter);

module.exports = router;
