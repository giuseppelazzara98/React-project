class DB {
  sqlite = require("sqlite3");
  constructor(dbname) {
    this.db = new this.sqlite.Database(dbname, (err) => {
      if (err) throw err;
    });
  }

  //SKUITEM
  deleteSKUItem(rfid) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM TABLE WHERE RFID=?"; //WRITE SQL COMMAND
      this.db.run(sql, [rfid], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }

  newTableName() {
    //MODIFY THIS FUNCTION
    return new Promise((resolve, reject) => {
      const sql =
        "CREATE TABLE IF NOT EXISTS NAMES(ID INTEGER PRIMARY KEY AUTOINCREMENT,NAME VARCHAR, SURNAME VARCHAR)";
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }

  postSkuItem(data) {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO TABLENAME(RFID,SKUId,DateOfStock,) VALUES(?, ?, ?)"; //WRITE SQL COMMAND
      this.db.run(sql, [data.RFID, data.SKUId, data.DateOfStock], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }

  putSkuItem(data) {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE(RFID,SKUId,DateOfStock,) VALUES(?, ?, ?)"; //WRITE SQL COMMAND
      this.db.run(
        sql,
        [data.newRFID, data.newAvailable, data.newDateOfStock],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.lastID);
        }
      );
    });
  }

  getSKUItems() {
    return new Promise((resolve, reject) => {
      const sql = ""; //WRITE SQL COMMAND
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const skuitems = rows.map((r) => ({
          RFID: r.RFID,
          SKUId: r.SKUId,
          Available: r.Available,
          DateOfStock: r.DateOfStock,
        }));
        resolve(skuitems);
      });
    });
  }

  getSKUItemsID(id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM WHERE id=?"; //WRITE SQL COMMAND
      this.db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const skuitemsID = rows.map((r) => ({
          RFID: r.RFID,
          SKUId: r.SKUId,
          DateOfStock: r.DateOfStock,
        }));
        resolve(skuitemsID);
      });
    });
  }

  getSKUItemsRFID(rfid) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM WHERE RFID=?"; //WRITE SQL COMMAND
      this.db.all(sql, [rfid], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const skuitemsRFID = rows.map((r) => ({
          RFID: r.RFID,
          SKUId: r.SKUId,
          Available: r.Available,
          DateOfStock: r.DateOfStock,
        }));
        resolve(skuitemsRFID);
      });
    });
  }

  //TEST RESULT

  getTestResultsByRFID(rfid) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM WHERE RFID=?"; //WRITE SQL COMMAND
      this.db.all(sql, [rfid], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const testResults = rows.map((r) => ({
          id: r.id,
          idTestDescriptor: r.idTestDescriptor,
          Date: r.Date,
          Result: r.Result,
        }));
        resolve(testResults);
      });
    });
  }

  getTestResultsById(rfid, id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM WHERE RFID=? AND ID=?"; //WRITE SQL COMMAND
      this.db.all(sql, [rfid, id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const testResults = rows.map((r) => ({
          id: r.id,
          idTestDescriptor: r.idTestDescriptor,
          Date: r.Date,
          Result: r.Result,
        }));
        resolve(testResults);
      });
    });
  }

  postTestResult(data) {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO TABLENAME(rfid,idTestDescriptor,Date,Result) VALUES(?, ?, ?, ?)"; //WRITE SQL COMMAND
      this.db.run(
        sql,
        [data.rfid, data.idTestDescriptor, data.Date, data.Result],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.lastID);
        }
      );
    });
  }

  putTestResult(data, rfid, id) {
    return new Promise((resolve, reject) => {
      const sql =
        "UPDATE(idTestDescriptor,Date,Result) VALUES(?, ?, ?) WHERE rfid=? AND id=?"; //WRITE SQL COMMAND
      this.db.run(
        sql,
        [data.newIdTestDescriptor, data.newDate, data.newResult, rfid, id],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.lastID);
        }
      );
    });
  }

  deleteTestResult(rfid, id) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM TABLE WHERE RFID=? AND id=?"; //WRITE SQL COMMAND
      this.db.run(sql, [rfid, id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }

  //ITEM

  getItems() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM TABLENAME"; //WRITE SQL COMMAND
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const items = rows.map((r) => ({
          id: r.id,
          description: r.description,
          price: r.price,
          SKUId: r.SKUId,
          supplierId: r.supplierId,
        }));
        resolve(items);
      });
    });
  }

  getItemsById(id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM WHERE ID=?"; //WRITE SQL COMMAND
      this.db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const items = rows.map((r) => ({
          id: r.id,
          description: r.description,
          price: r.price,
          SKUId: r.SKUId,
          supplierId: r.supplierId,
        }));
        resolve(items);
      });
    });
  }

  postItem(data) {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO TABLENAME(id,description,price,SKUId,supplierId) VALUES(?, ?, ?, ?, ?)"; //WRITE SQL COMMAND
      this.db.run(
        sql,
        [data.id, data.description, data.price, data.SKUId, data.supplierId],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.lastID);
        }
      );
    });
  }

  putItem(data, id) {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE(description,price) VALUES(?, ?) WHERE id=?"; //WRITE SQL COMMAND
      this.db.run(sql, [data.newDescription, data.newPrice, id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }

  deleteItem(id) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM TABLE WHERE id=?"; //WRITE SQL COMMAND
      this.db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }
}

module.exports = DB;
