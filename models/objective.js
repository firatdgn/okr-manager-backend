const db = require("../core/db-connection");

module.exports = {
    checkUserAuthorization(user, objectiveId, quarterId) {
        return new Promise((resolve, reject) => {
            let sql;
            if (objectiveId) {
                sql = `SELECT q.id FROM bhags AS b INNER JOIN quarters AS q ON b.id = q.bhag_id INNER JOIN objectives AS o ON o.quarter_id = q.id WHERE b.user='${user}' AND o.id = '${objectiveId}' AND (b.deleted_at IS NULL AND q.deleted_at IS NULL AND o.deleted_at IS NULL)`;
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
    create(content, quarterId, user) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                null,
                quarterId
            );
            if (!isUserAuthorized) {
                reject({
                    status: "error",
                    message: "User does not have authorization.",
                });
            }
            db.query(
                `
            INSERT INTO objectives(content, quarter_id) VALUES ('${content}', '${quarterId}')
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
    update(content, objectiveId, user) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                objectiveId,
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
				UPDATE objectives SET content = '${content}' WHERE id=${objectiveId}
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
    delete(user, objectiveId) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                objectiveId,
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
				UPDATE objectives SET deleted_at=CURRENT_TIMESTAMP() WHERE id=${objectiveId}
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
