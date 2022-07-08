"use strict";
//Data Access Object
const sqlite = require("sqlite3");

function course_dao() {
  const courseDB = new sqlite.Database(
    "./modules/database/dbexam.sqlite",
    (err) => {
      if (err) {
        console.log("Error connecting to DB");
        throw err;
      }
    }
  );

  this.getAllCourses = () => {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT C.code,C.name,C.cfu,C.maxStud,C.proped,count(CU.code) as numStud FROM COURSES C LEFT JOIN CoursesUsers CU ON CU.code=C.code GROUP BY C.code ORDER BY C.name";
      courseDB.all(sql, [], (err, rows) => {
        if (err) {
          reject(500);
          return;
        }
        const courses = rows.map((r) => ({
          code: r.code,
          name: r.name,
          cfu: r.cfu,
          maxStud: r.maxStud,
          proped: r.proped,
          numStud: r.numStud,
        }));
        resolve(courses);
      });
    });
  };

  this.getIncompatibilies = () => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM Incomp";
      courseDB.all(sql, [], (err, rows) => {
        if (err) {
          reject(500);
          return;
        }

        const courses = rows.map((r) => ({
          mainCode: r.mainCode,
          incompCode: r.incompCode,
        }));
        resolve(courses);
      });
    });
  };
}

module.exports = course_dao;
