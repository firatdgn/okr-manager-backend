const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const jose = require("jose");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const bhagRouter = require("./routes/bhag");
const quarterRouter = require("./routes/quarters");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", userRouter);

app.use(async (req, res, next) => {
    try {
        const jwt = req.headers.authorization.split(" ")[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload, protectedHeader } = await jose.jwtVerify(jwt, secret);
        if (payload) {
            res.locals.jwtPayload = payload;
            next();
        }
    } catch (error) {
        res.status(403).json({
            status: "error",
            message: "Token is not valid.",
        });
    }
});

app.use("/bhags", bhagRouter);
app.use("/quarters", quarterRouter);

module.exports = app;
