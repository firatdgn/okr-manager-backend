const EventEmitter = require("events");
const redisClient = require("../core/redis-cli");
const bhag = require("../models/bhag");

const eventEmitter = new EventEmitter();

eventEmitter.on("okrIsChanged", async (user, callback = () => {}) => {
    const bhags = await bhag.getAll({ user });
    redisClient.set(`${user}:bhag`, JSON.stringify(bhags), () => {
        callback();
    });
});

eventEmitter.on("error", (e) =>
    console.log("Event emitting error caught:", e.message)
);

module.exports = eventEmitter;
