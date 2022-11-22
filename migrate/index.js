require("dotenv").config();

const db = require("../core/db-connection");

db.query(
    `
	CREATE TABLE IF NOT EXISTS users (
		username varchar(255) NOT NULL UNIQUE,
		password text NOT NULL
	)
`,
    () => {
        process.exit();
    }
);
