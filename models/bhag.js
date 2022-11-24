const db = require("../core/db-connection");

module.exports = {
    create(content, user) {
        return new Promise((resolve, reject) => {
            db.query(
                `
			INSERT INTO bhags(content, user) VALUES ('${content}', '${user}')
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
    getAll(filter = null) {
        return new Promise((resolve, reject) => {
            let sql = ` SELECT id, content FROM bhags WHERE deleted_at IS NULL`;
            if (filter) {
                let whereClause = [];
                for (key in filter) {
                    whereClause.push(`${key} = '${filter[key]}'`);
                }
                sql += " AND " + whereClause.join(" AND ");
            }
            db.query(sql, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    },
    update(content, user, id) {
        return new Promise((resolve, reject) => {
            db.query(
                `
				UPDATE bhags SET content = '${content}' WHERE id=${id} and user = '${user}'
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
    delete(user, id) {
        return new Promise((resolve, reject) => {
            db.query(
                `
				UPDATE bhags SET deleted_at=CURRENT_TIMESTAMP() WHERE id=${id} and user = '${user}'
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
