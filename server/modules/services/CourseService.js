"use strict";
const courseDao = require("../dao/CourseDao");
const course_dao = new courseDao();
class course_service {
  getAllCourses = async () => {
    try {
      const courses = await course_dao.getAllCourses();
      return courses;
    } catch (err) {
      throw err;
    }
  };

  getIncompatibilies = async () => {
    try {
      const incompatibilities = await course_dao.getIncompatibilies();
      return incompatibilities;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = course_service;
