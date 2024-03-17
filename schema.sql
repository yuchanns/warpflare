CREATE TABLE IF NOT EXISTS Account (
	account_id TEXT,
	account_type TEXT,
	created_at DATETIME,
	updated_at DATETIME,
	model TEXT,
	referrer TEXT,
	private_key TEXT,
	license_key TEXT,
	token TEXT,
	premium_data INTEGER,
	quota INTEGER,
    USAGE INTEGER 
);

CREATE TABLE IF NOT EXISTS IP (
    address TEXT,
    loss TEXT,
    delay TEXT,
    name TEXT,
    unique_name TEXT
);

CREATE TABLE IF NOT EXISTS Task (
    name TEXT,
    triggered_at DATETIME
);

INSERT INTO Task (name, triggered_at)
VALUES
	("add-data", CURRENT_TIMESTAMP),
	("save-account", CURRENT_TIMESTAMP);
