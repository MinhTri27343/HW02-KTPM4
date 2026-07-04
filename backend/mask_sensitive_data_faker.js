const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { faker } = require("@faker-js/faker");

const dbPath = path.resolve(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function maskUsers() {
    try {
        console.log("==================================");
        console.log(" ChatGPT-assisted Data Masking");
        console.log("==================================");

        const users = await all(
            "SELECT id, email, phone FROM users ORDER BY id"
        );

        console.log(`Found ${users.length} users.\n`);

        console.log("===== BEFORE =====");

        users.forEach((u) => {
            console.log(
                `[${u.id}] ${u.email || "(null)"} | ${u.phone || "(null)"}`
            );
        });

        await run("BEGIN TRANSACTION");

        for (const user of users) {
            const fakeEmail = `user${user.id}_${faker.string.alphanumeric(
                6
            )}@faker.test`;

            const fakePhone = faker.helpers.replaceSymbols("09########");

            await run(
                `
                UPDATE users
                SET email = ?, phone = ?
                WHERE id = ?
            `,
                [fakeEmail, fakePhone, user.id]
            );
        }

        await run("COMMIT");

        const after = await all(
            "SELECT id, email, phone FROM users ORDER BY id"
        );

        console.log("\n===== AFTER =====");

        after.forEach((u) => {
            console.log(`[${u.id}] ${u.email} | ${u.phone}`);
        });

        console.log("\nData masking completed successfully.");
    } catch (err) {
        console.error(err);

        try {
            await run("ROLLBACK");
        } catch (_) {}

    } finally {
        db.close();
    }
}

maskUsers();