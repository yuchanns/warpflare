DROP TABLE
IF
	EXISTS Account;
CREATE TABLE Account (
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
