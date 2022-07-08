"use strict";
//Data Access Object
const sqlite = require("sqlite3");
const crypto = require("crypto");

function user_dao() {
  const db = new sqlite.Database("./modules/database/dbexam.sqlite", (err) => {
    if (err) {
      console.log("Error connecting to DB");
      throw err;
    }
  });

  this.getUser = (username, password) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM Users WHERE username = ?";
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(false);
        } else {
          const user = {
            id: row.id,
            username: row.username,
            name: row.name
          };
          const salt = row.salt;
          crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
            if (err) reject(err);
            const passwordHex = Buffer.from(row.password, "hex");
            if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) {
              resolve(false);
            } else resolve(user);
          });
        }
      });
    });
  };

  this.getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM Users WHERE id = ?";
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else if (row === undefined) resolve({ error: "User not found." });
        else {
          const user = {
            id: row.id,
            username: row.username,
            name: row.name
          };
          resolve(user);
        }
      });
    });
  };

  this.getPtft = (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT ptft FROM Users WHERE id = ?";
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else if (row === undefined) resolve({ error: "User not found." });
        else {
          const ptft = row.ptft;
          resolve(ptft);
        }
      });
    });
  };

  this.setPtft = (data, id) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE Users SET ptft=? WHERE id=?";
      db.run(sql, [data, id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  };
}

module.exports = user_dao;
