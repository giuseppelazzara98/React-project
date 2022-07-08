"use strict";
const express = require("express");
const routerSP = express.Router();
const SPService = require("../services/StudyPlanService");
const SP_service = new SPService();

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "not authenticated" });
};

routerSP.get("/studyplan", isLoggedIn, async (req, res) => {
  try {
    const studyplan = await SP_service.getStudyPlan(req.user.id);
    res.status(200).json(studyplan);
  } catch (err) {
    return res.status(500).send();
  }
});

routerSP.delete("/studyplan/user/all", isLoggedIn, async (req, res) => {
  try {
    await SP_service.deleteUserAll(req.user.id);
    return res.status(204).end();
  } catch (err) {
    return res.status(500).end();
  }
});

routerSP.post("/studyplan", isLoggedIn, async (req, res) => {
  try {
    if (req.body === undefined) {
      return res.status(422).send();
    }
    //check if each course code has 7 characters
    for (let index = 0; index < req.body.courses.length; index++) {
      const code = req.body.courses[index];
      if (code.length !== 7) return res.status(422).send();
    }
    //check if the field ptft is valid
    if (Number(req.body.ptft) !== 1 && Number(req.body.ptft) !== 0) {
      return res.status(422).send();
    }
    await SP_service.postCourses(req.body, req.user.id);
    return res.status(201).send();
  } catch (err) {
    if (err === 422) return res.status(err).send();
    else return res.status(500).send();
  }
});

module.exports = routerSP;
