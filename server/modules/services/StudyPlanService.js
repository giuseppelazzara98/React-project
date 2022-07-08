"use strict";
const SPDao = require("../dao/StudyPlanDao");
const CourseDao = require("../dao/CourseDao");
const UserDao = require("../dao/UserDao");
const course_dao = new CourseDao();
const sp_dao = new SPDao();
const user_dao = new UserDao();
class sp_service {
  getStudyPlan = async (id) => {
    try {
      const studyplan = await sp_dao.getStudyPlan(id);
      const ptft = await user_dao.getPtft(id);
      const complSP = {
        courses: studyplan,
        ptft: ptft,
      };
      return complSP;
    } catch (err) {
      throw err;
    }
  };

  deleteUserAll = async (id) => {
    try {
      await sp_dao.deleteUserAll(id);
      await user_dao.setPtft(null, id);
      return 204;
    } catch (err) {
      throw err;
    }
  };

  postCourses = async (data, id) => {
    try {
      const courses = await course_dao.getAllCourses(); //the entire list of the courses
      const incompatibilities = await course_dao.getIncompatibilies(); //the entire list of the incompatibilities
      const SP = await this.getStudyPlan(id);
      for (let index = 0; index < data.courses.length; index++) {
        //check for each course to add
        const courseToAdd = data.courses[index];
        if (
          checkMaxStud(courses, courseToAdd, SP) ||
          isPropedeutic(courses, courseToAdd, data.courses) ||
          isIncompatible(incompatibilities, courseToAdd, data.courses) ||
          checkCfu(data.ptft, data.courses, courses) ||
          isOnProvSP(data.courses, courseToAdd)
        ) {
          throw 422;
        }
      }
      // the correct solution to implement is a transaction and if something goes wrong
      // the database do a rollback
      await sp_dao.deleteUserAll(id);
      for (let index = 0; index < data.courses.length; index++) {
        const course = data.courses[index];
        await sp_dao.postCourses(course, id);
      }
      await user_dao.setPtft(data.ptft, id);
      return 201;
    } catch (err) {
      throw err;
    }
  };
}

function checkMaxStud(courses, course, SP) {
  // return true if the maximum number of student is reached
  for (let index = 0; index < courses.length; index++) {
    const element = courses[index];
    if (element.code === course) {
      if (element.maxStud === null) {
        return false;
      } else if (element.maxStud <= element.numStud) {
        //check if the course is already on the previous SP (if exist)
        if (SP.courses.length === 0)
          return true; //the student doesn't have a previous SP
        else {
          for (let index2 = 0; index2 < SP.courses.length; index2++) {
            const SP_course = SP.courses[index2];
            if (SP_course.code === element.code) return false; //the student has the course on the previous SP
          }
          return true; //the student doesn't have the course on the previous SP
        }
      } else if (element.maxStud > element.numStud) return false;
    }
  }
}

function isPropedeutic(allCourses, course, provSP) {
  //return true if there is a prerequisite
  let completeCourse = {};
  //retrieve the proped for the course from the list of all courses
  for (let index = 0; index < allCourses.length; index++) {
    const element = allCourses[index];
    if (element.code === course) {
      completeCourse = element;
    }
  }
  //check if a course has a prerequisite
  for (let index = 0; index < allCourses.length; index++) {
    const courseproped = allCourses[index];
    if (courseproped.code === completeCourse.proped) {
      //if yes, check if the prerequisite of the course is already on studyplan
      for (let index2 = 0; index2 < provSP.length; index2++) {
        const courseproped2 = provSP[index2];
        if (courseproped2 === completeCourse.proped) return false;
      }
      return true;
    }
  }
  return false;
}

function isIncompatible(incompatibilities, course, provSP) {
  //return true if there is an incompatibility
  let incompArray = [];
  //takes the incompatibilities for the specific course
  for (let index = 0; index < incompatibilities.length; index++) {
    const incompatibility = incompatibilities[index];
    if (incompatibility.mainCode === course)
      incompArray.push(incompatibility.incompCode);
  }
  //check  if an incompatibility for the current course is already on provisional study plan
  for (let index = 0; index < incompArray.length; index++) {
    for (let index2 = 0; index2 < provSP.length; index2++) {
      if (incompArray[index] === provSP[index2]) {
        return true;
      }
    }
  }
  return false;
}

function checkCfu(ptft, provSp, courses) {
  let cfu = 0;
  for (let index = 0; index < courses.length; index++) {
    const courseFromAll = courses[index];
    for (let index1 = 0; index1 < provSp.length; index1++) {
      const courseSP = provSp[index1];
      if (courseFromAll.code === courseSP) {
        cfu += courseFromAll.cfu;
      }
    }
  }
  if (ptft === 1) {
    //part-time case
    if (cfu >= 20 && cfu <= 40) return false;
    else return true;
  } else if (ptft === 0) {
    //full-time case
    if (cfu >= 60 && cfu <= 80) return false;
    else return true;
  }
}

function isOnProvSP(provSP, course) {
  let i = 0;
  for (let index = 0; index < provSP.length; index++) {
    const courseSP = provSP[index];
    if (courseSP === course) {
      i++;
    }
  }
  return i >= 2;
}

module.exports = sp_service;
