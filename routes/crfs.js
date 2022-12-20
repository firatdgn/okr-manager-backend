const express = require("express");
const crf = require("../models/crf");
const dbEvents = require("../events/db-events");

const router = express.Router({ mergeParams: true });

router.post("/", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    try {
        const result = await crf.create(
            req.body.crfDate,
            req.params.keyResultId,
            payload.aud
        );
        if (result.affectedRows > 0) {
            dbEvents.emit("okrIsChanged", payload.aud, () => {
                res.status(201).json({
                    status: "success",
                    message: "CRF is created",
                });
            });
        } else {
            res.status(400).json({
                status: "error",
                message: "Couldn't create the CRF",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Couldn't create the CRF",
        });
    }
});
router.put("/:crfId", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await crf.update(
        req.body.crfDate,
        req.body.crfStatus,
        req.params.crfId,
        payload.aud
    );
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud, () => {
            res.status(201).json({
                status: "success",
                message: "CRF is updated",
            });
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't update the CRF",
        });
    }
});

router.delete("/:crfId", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await crf.delete(payload.aud, req.params.crfId);
    if (result.affectedRows > 0) {
        dbEvents.emit("okrIsChanged", payload.aud, () => {
            res.status(200).json({
                status: "success",
                message: "CRF is deleted",
            });
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't delete the CRF",
        });
    }
});

module.exports = router;
