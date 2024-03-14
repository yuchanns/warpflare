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

DROP TABLE
IF
    EXISTS IP;
CREATE TABLE IP (
    address TEXT,
    loss TEXT,
    delay TEXT,
    name TEXT,
    unique_name TEXT
);

INSERT INTO IP (address, loss, delay, name, unique_name)
VALUES
	("162.159.195.16:903", "0.00%", "164 ms", "🇺🇸 US", "🇺🇸 US-CF-Red"),
	("162.159.195.137:8742", "0.00%", "164 ms", "🇺🇸 US", "🇺🇸 US-CF-Indigo"),
	("162.159.195.114:955", "0.00%", "172 ms", "🇺🇸 US", "🇺🇸 US-CF-Pink"),
	("162.159.192.189:968", "0.00%", "173 ms", "🇺🇸 US", "🇺🇸 US-CF-Blue"),
	("162.159.195.137:1074", "0.00%", "186 ms", "🇺🇸 US", "🇺🇸 US-CF-Green"),
	("162.159.192.186:878", "0.00%", "197 ms", "🇺🇸 US", "🇺🇸 US-CF-Brown"),
	("162.159.195.48:878", "0.00%", "200 ms", "🇺🇸 US", "🇺🇸 US-CF-Violet"),
	("188.114.97.134:5279", "0.00%", "226 ms", "🇳🇱 NL", "🇳🇱 NL-CF-Red"),
	("162.159.195.205:878", "10.00%", "250 ms", "🇺🇸 US", "🇺🇸 US-CF-White"),
	("162.159.195.222:908", "10.00%", "250 ms", "🇺🇸 US", "🇺🇸 US-CF-Orange"),
	("162.159.195.140:7103", "10.00%", "254 ms", "🇺🇸 US", "🇺🇸 US-CF-Black");
