const db = require("../core/db-connection");
const crypto = require("crypto");

module.exports = {
    create(username, password) {
        return new Promise((resolve, reject) => {
            password = crypto
                .createHash("sha256")
                .update(password)
                .digest("base64");
            db.query(
                `
			INSERT INTO users(username, password) VALUES ('${username}', '${password}')
			`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res);
                }
            );
        });
    },
    doesExist(username, password) {
        return new Promise((resolve, reject) => {
            password = crypto
                .createHash("sha256")
                .update(password)
                .digest("base64");
            db.query(
                `
			SELECT * FROM users WHERE username='${username}' AND password='${password}'
			`,
                (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res.length > 0);
                }
            );
        });
    },
};
