import {
  Table,
  Button,
  Card,
  ListGroup,
  Container,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useState } from "react";

function Courses(props) {
  return (
    <Container fluid>
      <Row>
        <Col>
          <h2 className="title-allCourses">Courses</h2>
        </Col>
      </Row>
      <Row>
        <Col className="ml-30">
          <Table hover size="sm">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>CFU</th>
                <th>Actual Student</th>
                <th>Max number of student</th>
                <th>Details</th>
                {props.editableMode ? <th>Add</th> : <></>}
              </tr>
            </thead>
            <tbody>
              {props.courses.map((course) => (
                <CourseRow
                  ptft={props.ptft}
                  cfu={props.cfu}
                  setCfu={props.setCfu}
                  editableMode={props.editableMode}
                  course={course}
                  courses={props.courses}
                  key={course.code}
                  incompatibilities={props.incompatibilities}
                  setProvStudyplan={props.setProvStudyplan}
                  provStudyplan={props.provStudyplan}
                  studyplan={props.studyplan}
                />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

function CourseRow(props) {
  const [tab, setTab] = useState(false);
  const [errorEnabled, setErrorEnabled] = useState(false);
  let errorvar = "";
  return (
    <>
      <tr
        onClick={() => {
          if (errorvar !== "") {
            setErrorEnabled(true);
            setTimeout(() => setErrorEnabled(false), 4000);
          }
        }}
      >
        <td>{props.course.code}</td>
        <td>{props.course.name}</td>
        <td>{props.course.cfu}</td>
        <td>{props.course.numStud}</td>
        <td>{props.course.maxStud}</td>

        <td>
          {" "}
          <Button
            variant="secondary"
            onClick={() => {
              errorvar = "";
              setTab((value) => !value);
            }}
          >
            {tab ? "↑" : "↓"}
          </Button>
        </td>

        {props.editableMode ? (
          <td>
            <Button
              disabled={
                isOnProvSP(
                  props.provStudyplan,
                  props.course,
                  props.provStudyplan
                ) ||
                isIncompatible(
                  props.incompatibilities,
                  props.course,
                  props.provStudyplan
                ) ||
                isPropedeutic(
                  props.courses,
                  props.course,
                  props.provStudyplan
                ) ||
                checkMaxStud(props.courses, props.course.code, props.studyplan.courses) ||
                checkCfuAdd(props.ptft, props.course, props.cfu)
                  ? true
                  : false
              }
              onClick={() => {
                if (!checkCfuAdd(props.ptft, props.course, props.cfu)) {
                  props.setProvStudyplan((sp) =>
                    sp.concat({
                      code: props.course.code,
                      name: props.course.name,
                      cfu: props.course.cfu,
                      proped: props.course.proped,
                    })
                  );
                  props.setCfu((cfu) => cfu + props.course.cfu);
                }
              }}
              variant="outline-secondary"
              size="1"
            >
              +
            </Button>
          </td>
        ) : (
          <></>
        )}
      </tr>
      {errorEnabled ? (
        <tr>
          <td colSpan={6}>
            {" "}
            <Alert variant="danger">{errorvar}</Alert>
          </td>
        </tr>
      ) : (
        <></>
      )}
      {tab ? (
        <tr>
          <td colSpan={6} className=" border border-bottom-0  rounded-pill">
            {" "}
            <Card className="customized-color">
              <Card.Header>Prerequisite</Card.Header>{" "}
              <ListGroup variant="flush">
                {" "}
                {props.courses
                  .filter((course) => course.code === props.course.proped)
                  .map((course) => (
                    <ListGroup.Item key={course.code}>
                      <b>Code:</b> {course.code}
                      <br></br> <b>Name:</b> {course.name} <br></br>
                      <b>CFU: </b>
                      {course.cfu} <br></br>
                      <b>Actual Student: </b> {course.numStud} <br></br>
                      <b>Max Number of students: </b>
                      {course.maxStud ? course.maxStud : "no limits"}{" "}
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card>
          </td>
        </tr>
      ) : (
        ""
      )}
      {tab ? (
        <tr>
          <td colSpan={6} className=" border border-top-0  rounded-pill">
            <Card className="customized-color">
              <Card.Header>Incompatibilities</Card.Header>{" "}
              <ListGroup variant="flush">
                {" "}
                {getNames(
                  props.incompatibilities
                    .filter((code) => code.mainCode === props.course.code)
                    .map((code) => code.incompCode),
                  props.courses
                )}
              </ListGroup>
            </Card>
          </td>
        </tr>
      ) : (
        ""
      )}
    </>
  );

  function isOnProvSP(provSP, course) {
    for (let index = 0; index < provSP.length; index++) {
      const courseSP = provSP[index];
      if (courseSP.code === course.code) {
        errorvar = "The course has already been selected";
        return true;
      }
    }
    return false;
  }

  function isIncompatible(incompatibilities, course, provSP) {
    let incompArray = [];
    //takes the incompatibilities for the specific course
    for (let index = 0; index < incompatibilities.length; index++) {
      const incompatibility = incompatibilities[index];
      if (incompatibility.mainCode === course.code)
        incompArray.push(incompatibility.incompCode);
    }
    //check  if an incompatibility for the current course is already on provisional study plan
    for (let index = 0; index < incompArray.length; index++) {
      for (let index2 = 0; index2 < provSP.length; index2++) {
        if (incompArray[index] === provSP[index2].code) {
          errorvar = "The course is incompatibile with " + provSP[index2].name;
          return true;
        }
      }
    }
    return false;
  }

  function isPropedeutic(allCourses, course, provSP) {
    //check if a course has a prerequisite
    for (let index = 0; index < allCourses.length; index++) {
      const courseproped = allCourses[index];
      if (courseproped.code === course.proped) {
        const namecourse = courseproped.name;
        //if yes, check if the prerequisite of the course is already on studyplan
        for (let index2 = 0; index2 < provSP.length; index2++) {
          const courseproped2 = provSP[index2];
          if (courseproped2.code === course.proped) return false;
        }
        errorvar =
          "The course need " + namecourse + " as a prerequisite course";
        return true;
      }
    }
    return false;
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
          const SP_arr = SP.map((course) => course.code);
          if (SP_arr.length === 0){
            errorvar="The course has been reached the maximum number of student";
            return true; //the student doesn't have a previous SP
          }
          else {
            for (let index2 = 0; index2 < SP_arr.length; index2++) {
              const SP_course = SP_arr[index2];
              if (SP_course === element.code) 
              return false; //the student has the course on the previous SP
            }
            errorvar="The course has been reached the maximum number of student";
            return true; //the student doesn't have the course on the previous SP
          }
        } else if (element.maxStud > element.numStud) return false;
      }
    }
  }

  function checkCfuAdd(ptft, course, cfu) {
    let newcfu = 0;
    newcfu = cfu + course.cfu;
    //check if part time <=40
    if (ptft === 1) {
      if (newcfu <= 40) return false;
      else {
        errorvar =
          "If you add this course you exceed the maximum threshold for your study plan or you can consider a full-time plan";
        return true;
      }
    }
    //check if full-time <=80
    else if (ptft === 0) {
      if (newcfu <= 80) return false;
      else {
        errorvar =
          "If you add this course you exceed the maximum threshold for your study plan";
        return true;
      }
    }
  }
}
function getNames(codeList, courseList) {
  let arr = [];
  courseList.forEach((course) => {
    codeList.forEach((code) => {
      if (code === course.code) {
        arr.push(
          <ListGroup.Item key={course.code}>
            {" "}
            <b>Code:</b> {course.code} <br></br>
            <b>Name: </b>
            {course.name} <br></br>
            <b>CFU: </b>
            {course.cfu}
            <br></br> <b>Actual student:</b> {course.numStud} <br></br>
            <b>Max Number of students:</b>{" "}
            {course.maxStud ? course.maxStud : "no limits"}
          </ListGroup.Item>
        );
      }
    });
  });
  return arr;
}

export { Courses };
