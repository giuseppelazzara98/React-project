"use strict";
const { reject } = require("bcrypt/promises");
const userDao = require("../dao/UserDao");

const user_dao = new userDao();
class user_service {
  getUser = async (username, password) => {
    try {
      const user = await user_dao.getUser(username, password);
      return user;
    } catch (err) {
      return false;
    }
  };
  getUserById = async (id) => {
    try {
      const user = await user_dao.getUserById(id);
      return user;
    } catch (err) {
      reject(false);
    }
  };
}

module.exports = user_service;
