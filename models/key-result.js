const db = require("../core/db-connection");

module.exports = {
    checkUserAuthorization(user, keyResultId, objectiveId) {
        return new Promise((resolve, reject) => {
            let sql;
            if (keyResultId) {
                sql = `SELECT q.id FROM bhags AS b INNER JOIN quarters AS q ON b.id = q.bhag_id INNER JOIN objectives AS o ON o.quarter_id = q.id INNER JOIN key_results AS k ON k.objective_id = o.id WHERE b.user='${user}' AND k.id = '${keyResultId}' AND (b.deleted_at IS NULL AND q.deleted_at IS NULL AND o.deleted_at IS NULL)`;
            } else if (objectiveId) {
                sql = `SELECT q.id FROM bhags AS b INNER JOIN quarters AS q ON b.id = q.bhag_id INNER JOIN objectives AS o ON o.quarter_id = q.id WHERE b.user='${user}' AND o.id = '${objectiveId}' AND (b.deleted_at IS NULL AND q.deleted_at IS NULL AND o.deleted_at IS NULL)`;
            }
            db.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows.length > 0);
            });
        });
    },
    create(content, objectiveId, user) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                null,
                objectiveId
            );
            if (!isUserAuthorized) {
                reject({
                    status: "error",
                    message: "User does not have authorization.",
                });
            }
            db.query(
                `
            INSERT INTO key_results(content, objective_id) VALUES ('${content}', '${objectiveId}')
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
    update(content, keyResultId, user) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                keyResultId,
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
				UPDATE key_results SET content = '${content}' WHERE id=${keyResultId}
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
    delete(user, keyResultId) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                keyResultId,
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
				UPDATE key_results SET deleted_at=CURRENT_TIMESTAMP() WHERE id=${keyResultId}
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
