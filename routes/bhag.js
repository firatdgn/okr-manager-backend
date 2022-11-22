const express = require("express");
const bhag = require("../models/bhag");

const router = express.Router();

router.get("/", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const bhags = await bhag.getAll({ user: payload.aud });
    res.status(200).json(bhags);
});
router.post("/", async (req, res, next) => {
    const payload = res.locals.jwtPayload;
    const result = await bhag.create(req.body.bhagName, payload.aud);
    if (result.affectedRows > 0) {
        res.status(201).json({
            status: "success",
            message: "BHAG is created",
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
        req.body.bhagName,
        payload.aud,
        req.params.id
    );
    if (result.affectedRows > 0) {
        res.status(201).json({
            status: "success",
            message: "BHAG is updated",
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
        res.status(200).json({
            status: "success",
            message: "BHAG is deleted",
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "Couldn't delete the BHAG",
        });
    }
});

module.exports = router;
