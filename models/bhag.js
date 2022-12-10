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
            let sql = `SELECT b.id AS bhagId, b.content AS bhagContent, q.id AS quarterId, q.started_at AS quarterStartedAt, q.finished_at AS quarterFinishedAt, o.id AS objectiveId, o.content AS objectiveContent, k.id AS keyResultId, k.content AS keyResultContent, k.required_status AS keyResultFinishedAt, c.id AS crfId, c.date AS crfDate, c.current_status AS crfCurrentStatus FROM bhags AS b LEFT JOIN quarters AS q ON b.id = q.bhag_id LEFT JOIN objectives AS o ON o.quarter_id = q.id LEFT JOIN key_results AS k ON k.objective_id = o.id LEFT JOIN crfs AS c ON k.id = c.key_result_id WHERE b.user='${filter.user}' AND (b.deleted_at IS NULL AND q.deleted_at IS NULL AND o.deleted_at IS NULL AND c.deleted_at IS NULL) ORDER BY b.id ASC, q.started_at ASC, o.id ASC, k.id ASC, c.date`;
            db.query(sql, (err, res) => {
                if (err) {
                    reject(err);
                }
                let okr = {};
                for (row of res) {
                    let quarters;
                    let objectives;
                    let keyResults;
                    let crfs;
                    quarters = okr[row.bhagId]?.["quarters"] ?? {};
                    okr[row.bhagId] = {
                        id: row.bhagId,
                        content: row.bhagContent,
                        quarters: quarters,
                    };
                    if (row.quarterId === null) {
                        continue;
                    }
                    objectives = quarters[row.quarterId]?.["objectives"] ?? {};
                    quarters[row.quarterId] = {
                        quarter: "Q",
                        startDate: row.quarterStartedAt,
                        finishDate: row.quarterFinishedAt,
                        objectives: objectives,
                    };
                    if (row.objectiveId === null) {
                        continue;
                    }
                    keyResults =
                        objectives[row.objectiveId]?.["keyResults"] ?? {};
                    objectives[row.objectiveId] = {
                        id: row.objectiveId,
                        content: row.objectiveContent,
                        keyResults: keyResults,
                    };
                    if (!row.keyResultId) {
                        continue;
                    }
                    crfs = keyResults[row.keyResultId]?.["crfs"] ?? {};
                    keyResults[row.keyResultId] = {
                        id: row.keyResultId,
                        content: row.keyResultContent,
                        finishedAt: row.keyResultFinishedAt,
                        crfs: crfs,
                    };
                    if (!row.crfId) {
                        continue;
                    }
                    crfs[row.crfId] = {
                        id: row.crfId,
                        date: row.crfDate,
                        currentStatus: row.crfCurrentStatus,
                    };
                }

                resolve(okr);
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
