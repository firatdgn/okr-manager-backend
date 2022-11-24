const db = require("../core/db-connection");

module.exports = {
    checkUserAuthorization(user, quarterId = null, bhagId = null) {
        return new Promise((resolve, reject) => {
            let sql;
            if (bhagId) {
                sql = `SELECT id FROM bhags WHERE bhags.user = '${user}' AND bhags.id = ${bhagId} AND bhags.deleted_at IS NULL`;
            } else if (quarterId) {
                sql = `SELECT quarters.id FROM bhags INNER JOIN quarters ON bhags.id = quarters.bhag_id WHERE bhags.user = '${user}' AND quarters.id = ${quarterId} AND (bhags.deleted_at IS NULL OR quarters.deleted_at IS NULL)`;
            }
            db.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows.length > 0);
            });
        });
    },
    create(startedAt, finishedAt, bhagId, user) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                null,
                bhagId
            );
            if (!isUserAuthorized) {
                reject({
                    status: "error",
                    message: "User does not have authorization.",
                });
            }
            db.query(
                `
			INSERT INTO quarters(started_at, finished_at, bhag_id) VALUES ('${startedAt}', '${finishedAt}', '${bhagId}')
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
    update(startedAt, finishedAt, quarterId, user) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                quarterId,
                null
            );
            if (!isUserAuthorized) {
                reject({
                    status: "error",
                    message: "User does not have authorization.",
                });
            }
            db.query(
                `
				UPDATE quarters SET started_at = '${startedAt}', finished_at = '${finishedAt}' WHERE id=${quarterId}
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
    delete(user, quarterId) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                quarterId,
                null
            );
            if (!isUserAuthorized) {
                reject({
                    status: "error",
                    message: "User does not have authorization.",
                });
            }
            db.query(
                `
				UPDATE quarters SET deleted_at=CURRENT_TIMESTAMP() WHERE id=${quarterId}
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
};
