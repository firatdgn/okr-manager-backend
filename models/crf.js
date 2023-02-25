const db = require("../core/db-connection");

module.exports = {
    checkUserAuthorization(user, crfId, keyResultId) {
        return new Promise((resolve, reject) => {
            let sql;
            if (crfId) {
                sql = `SELECT q.id FROM bhags AS b INNER JOIN quarters AS q ON b.id = q.bhag_id INNER JOIN objectives AS o ON o.quarter_id = q.id INNER JOIN key_results AS k ON k.objective_id = o.id INNER JOIN crfs AS c WHERE b.user='${user}' AND c.id = '${crfId}' AND (b.deleted_at IS NULL AND q.deleted_at IS NULL AND o.deleted_at IS NULL AND c.deleted_at IS NULL)`;
            } else if (keyResultId) {
                sql = `SELECT q.id FROM bhags AS b INNER JOIN quarters AS q ON b.id = q.bhag_id INNER JOIN objectives AS o ON o.quarter_id = q.id INNER JOIN key_results AS k ON k.objective_id = o.id WHERE b.user='${user}' AND k.id = '${keyResultId}' AND (b.deleted_at IS NULL AND q.deleted_at IS NULL AND o.deleted_at IS NULL)`;
            }
            db.query(sql, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows.length > 0);
            });
        });
    },
    create(date, currentStatus, keyResultId, user) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                null,
                keyResultId
            );
            if (!isUserAuthorized) {
                reject({
                    status: "error",
                    message: "User does not have authorization.",
                });
            }
            db.query(
                `
            INSERT INTO crfs(date, current_status, key_result_id) VALUES ('${date}', ${currentStatus}, '${keyResultId}')
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
    update(date, currentStatus, crfId, user) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                crfId,
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
				UPDATE crfs SET date = '${date}', current_status = '${currentStatus}' WHERE id=${crfId}
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
    delete(user, crfId) {
        return new Promise(async (resolve, reject) => {
            let isUserAuthorized = await this.checkUserAuthorization(
                user,
                crfId,
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
				UPDATE crfs SET deleted_at=CURRENT_TIMESTAMP() WHERE id=${crfId}
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
