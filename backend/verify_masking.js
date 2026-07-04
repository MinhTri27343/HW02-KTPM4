const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
    path.resolve(__dirname, "database.sqlite")
);

function get(sql) {
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

async function verify() {
    console.log("\n========== VERIFY ==========\n");

    const total = await get(
        "SELECT COUNT(*) AS count FROM users"
    );

    console.log("Total users:", total.count);

    const nullEmail = await get(
        "SELECT COUNT(*) AS count FROM users WHERE email IS NULL"
    );

    console.log(
        "Null email:",
        nullEmail.count === 0 ? "PASS" : "FAIL"
    );

    const nullPhone = await get(
        "SELECT COUNT(*) AS count FROM users WHERE phone IS NULL"
    );

    console.log(
        "Null phone:",
        nullPhone.count === 0 ? "PASS" : "FAIL"
    );

    const duplicate = await get(`
        SELECT COUNT(*) AS count
        FROM (
            SELECT email
            FROM users
            GROUP BY email
            HAVING COUNT(*) > 1
        )
    `);

    console.log(
        "Duplicate email:",
        duplicate.count === 0 ? "PASS" : "FAIL"
    );

    const fakeEmail = await get(`
        SELECT COUNT(*) AS count
        FROM users
        WHERE email LIKE '%@faker.test'
    `);

    console.log(
        "Masked email:",
        fakeEmail.count === total.count ? "PASS" : "FAIL"
    );

    console.log("\nVerification completed.");

    db.close();
}

verify();