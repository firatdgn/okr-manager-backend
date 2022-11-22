const redis = require("redis");

const redisClient = redis.createClient(6379, "127.0.0.1");

console.log(redisClient.set("name", "final test"));
