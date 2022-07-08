"use strict";
//Data Access Object
const sqlite = require("sqlite3");

function SP_dao() {
  const SPDB = new sqlite.Database(
    "./modules/database/dbexam.sqlite",
    (err) => {
      if (err) {
        console.log("Error connecting to DB");
        throw err;
      }
    }
  );

  this.getStudyPlan = (id) => {
    return new Promise((resolve, reject) => {
      const sql =
        "SELECT C.code, C.name,C.cfu, C.maxStud, C.proped FROM Courses C, Users U, CoursesUsers CU WHERE U.id=? AND C.code=CU.code AND U.id=CU.iduser ORDER BY C.name";
      SPDB.all(sql, [id], (err, rows) => {
        if (err) {
          reject(500);
          return;
        }
        const studyplan = rows.map((r) => ({
          code: r.code,
          name: r.name,
          cfu: r.cfu,
          maxStud: r.maxStud,
          proped: r.proped,
        }));
        resolve(studyplan);
      });
    });
  };

  this.deleteUserAll = (id) => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM CoursesUsers WHERE iduser=?";
      SPDB.run(sql, [id], (err) => {
        if (err) {
          reject(500);
          return;
        }
        resolve(true);
      });
    });
  };

  this.postCourses = (data, id) => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO CoursesUsers(code,iduser) VALUES(?,?)";
      SPDB.run(sql, [data, id], (err) => {
        if (err) {
          reject(500);
          return;
        }
        resolve(true);
      });
    });
  };
}

module.exports = SP_dao;
