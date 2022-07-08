"use strict";
const express = require("express");
const routerCourse = express.Router();
const courseService = require("../services/CourseService");
const course_service = new courseService();

routerCourse.get("/courses", async (req, res) => {
  try {
    const courses = await course_service.getAllCourses();
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).send();
  }
});

routerCourse.get("/courses/incompatibilities", async (req, res) => {
  try {
    const incompatibilities = await course_service.getIncompatibilies();
    return res.status(200).json(incompatibilities);
  } catch (err) {
    return res.status(500).send();
  }
});

module.exports = routerCourse;
