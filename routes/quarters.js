const express = require("express");
const quarter = require("../models/quarter");

const router = express.Router();

router.post("/", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    try {
        const result = await quarter.create(
            req.body.startedAt,
            req.body.finishedAt,
            req.body.bhagId,
            payload.aud
        );
        if (result.affectedRows > 0) {
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
router.put("/:id", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await quarter.update(
        req.body.startedAt,
        req.body.finishedAt,
        req.params.id,
        payload.aud
    );
    if (result.affectedRows > 0) {
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

router.delete("/:id", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await quarter.delete(payload.aud, req.params.id);
    if (result.affectedRows > 0) {
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

module.exports = router;
