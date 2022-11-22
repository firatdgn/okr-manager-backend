require("dotenv").config();

const db = require("../core/db-connection");

db.query(
    `
	CREATE TABLE IF NOT EXISTS users (
		username varchar(255) NOT NULL UNIQUE,
		password text NOT NULL
	)
`
);
db.query(
    `
	CREATE TABLE IF NOT EXISTS bhags (
		id INT(255) UNSIGNED NOT NULL AUTO_INCREMENT,
		content text NOT NULL,
		user text NOT NULL,
		deleted_at TIMESTAMP NULL DEFAULT NULL,
		PRIMARY KEY (id)
	)
`
);
db.query(
    `
	CREATE TABLE IF NOT EXISTS quarters (
		id INT(255) UNSIGNED NOT NULL AUTO_INCREMENT,
		started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
		finished_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
		bhag_id INT(255) UNSIGNED NOT NULL,
		deleted_at TIMESTAMP NULL DEFAULT NULL,
		PRIMARY KEY (id),
		FOREIGN KEY (bhag_id) REFERENCES bhags(id)
	)
`
);
db.query(
    `
	CREATE TABLE IF NOT EXISTS objectives (
		id INT(255) UNSIGNED NOT NULL AUTO_INCREMENT,
		content text NOT NULL,
		quarter_id INT(255) UNSIGNED NOT NULL,
		deleted_at TIMESTAMP NULL DEFAULT NULL,
		PRIMARY KEY (id),
		FOREIGN KEY (quarter_id) REFERENCES quarters(id)
	)
`
);
db.query(
    `
	CREATE TABLE IF NOT EXISTS key_results (
		id INT(255) UNSIGNED NOT NULL AUTO_INCREMENT,
		content text NOT NULL,
		objective_id INT(255) UNSIGNED NOT NULL,
		deleted_at TIMESTAMP NULL DEFAULT NULL,
		PRIMARY KEY (id),
		FOREIGN KEY (objective_id) REFERENCES objectives(id)
	)
`
);
db.query(
    `
	CREATE TABLE IF NOT EXISTS crfs (
		id INT(255) UNSIGNED NOT NULL AUTO_INCREMENT,
		date TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
		current_status INT(3) UNSIGNED NOT NULL,
		key_result_id INT(255) UNSIGNED NOT NULL,
		deleted_at TIMESTAMP NULL DEFAULT NULL,
		PRIMARY KEY (id),
		FOREIGN KEY (key_result_id) REFERENCES key_results(id)
	)
`
);
