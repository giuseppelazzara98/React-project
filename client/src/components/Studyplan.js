import { useState } from "react";
import {
  Table,
  Row,
  Col,
  Container,
  Button,
  ToggleButton,
  ButtonGroup,
  Card,
  Alert,
} from "react-bootstrap";
import { BsFillTrashFill } from "react-icons/bs";

function Studyplan(props) {
  const [errorSubmit, setErrorSubmit] = useState("");
  let cfu = props.studyplan ? sumCfu(props.studyplan.courses) : 0;
  const radios = [
    { name: "Part-time", value: 1 },
    { name: "Full-time", value: 0 },
  ];

  function checkCfuSubmit(ptft, cfu) {
    if (ptft === 1) {
      if (cfu >= 20 && cfu <= 40) {
        return true;
      } else {
        setErrorSubmit(
          "The credits entered do not correspond to those foreseen in the selected study plan "
        );
        return false;
      }
    } else if (ptft === 0) {
      if (cfu >= 60 && cfu <= 80) {
        return true;
      } else {
        setErrorSubmit(
          "The credits entered do not correspond to those foreseen in the selected study plan"
        );
        return false;
      }
    }
  }

  function isPropedeutic(allCourses, course, provSP) {
    //check if a course has a prerequisite
    for (let index = 0; index < allCourses.length; index++) {
      const courseproped = allCourses[index];
      if (courseproped.code === course.proped) {
        //if yes, check if the prerequisite of the course is already on studyplan
        for (let index2 = 0; index2 < provSP.length; index2++) {
          const courseproped2 = provSP[index2];
          if (courseproped2.code === course.proped) return true;
        }
        return false;
      }
    }
    return true;
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
          return false;
        }
      }
    }
    return true;
  }

  function isOnProvSP(provSP, course) {
    for (let index = 0; index < provSP.length; index++) {
      const courseSP = provSP[index];
      if (courseSP.code === course.code) {
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
          return true;
        } else if (element.maxStud <= element.numStud) {
          //check if the course is already on the previous SP (if exist)
          const SP_arr = SP.map((course) => course.code);
          if (SP_arr.length === 0)
            return false; //the student doesn't have a previous SP
          else {
            for (let index2 = 0; index2 < SP_arr.length; index2++) {
              const SP_course = SP_arr[index2];
              if (SP_course === element.code) return true; //the student has the course on the previous SP
            }
            return false; //the student doesn't have the course on the previous SP
          }
        } else if (element.maxStud > element.numStud) return true;
      }
    }
  }

  function allChecks(provSP, incompatibilities, allCourses, SP) {
    for (let index = 0; index < provSP.length; index++) {
      const courseToCheck = provSP[index];
      if (
        !(
          isIncompatible(incompatibilities, courseToCheck, provSP) &&
          isPropedeutic(allCourses, courseToCheck, provSP) &&
          isOnProvSP(provSP, courseToCheck) &&
          checkMaxStud(allCourses, courseToCheck.code, SP)
        )
      ) {
        setErrorSubmit("An error occured on the validation of the studyplan");
        return false;
      }
    }
    return true;
  }
  return (
    <>
      {props.studyplan.courses.length === 0 ||
      props.provStudyplan.length !== 0 ? (
        <>
          {!props.editableMode ? (
            <div>
              <h3 className="compile-new">
                Study plan help you to create and manage your study plan{" "}
              </h3>
              Push{" "}
              <Button
                onClick={() => props.setEditableMode(true)}
                variant="secondary"
                size="sm"
              >
                Add{" "}
              </Button>
              and start with the creation selecting the courses directly from
              the list on the left side
            </div>
          ) : (
            <></>
          )}
          {/*The studyplan not exist */}

          {props.editableMode ? (
            <Container fluid>
              <h2 className="title-allCourses">Study plan</h2>
              <div>Select the type of study plan :</div>
              <ButtonGroup>
                {radios.map((radio, idx) => (
                  <ToggleButton
                    size="sm"
                    className="toggle-button"
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant={idx % 2 ? "outline-secondary" : "light "}
                    name="radio"
                    value={Number(radio.value)}
                    checked={props.ptft === radio.value}
                    onChange={(e) => {
                      props.setPtft(Number(e.currentTarget.value));
                    }}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
              {props.ptft ? (
                <Card>
                  <Card.Body>
                    With the option <b>Part-time</b> you can select:
                    <br></br> <b>Minimum: </b>20 CFU<br></br>
                    <b>Maximum:</b> 40 CFU
                  </Card.Body>{" "}
                </Card>
              ) : (
                <Card>
                  <Card.Body>
                    With the option <b>Full-time</b> you can select:
                    <br></br> <b>Minimum: </b>60 CFU<br></br>
                    <b>Maximum:</b> 80 CFU
                  </Card.Body>{" "}
                </Card>
              )}

              <Table hover size="sm">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>CFU</th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {props.provStudyplan.map((course) => (
                    <CourseRow
                      course={course}
                      key={course.code}
                      editableMode={props.editableMode}
                      courses={props.courses}
                      setProvStudyplan={props.setProvStudyplan}
                      provStudyplan={props.provStudyplan}
                      setCfu={props.setCfu}
                    />
                  ))}
                  <tr>
                    <td></td>
                    <td> </td>
                    <td>{props.cfu}</td>
                  </tr>
                </tbody>
              </Table>

              <Container fluid>
                <Row>
                  {" "}
                  <Col>
                    <Button
                      variant="danger"
                      onClick={() => {
                        props.setProvStudyplan([]);
                        props.setCfu(0);
                        props.setEditableMode(false);
                      }}
                    >
                      Delete provisional
                    </Button>
                  </Col>
                  <Col>
                    {props.studyplan.courses.length !== 0 ? (
                      <Button onClick={props.deleteSP} variant="danger">
                        Delete permanent
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Col>{" "}
                  <Col>
                    <Button
                      onClick={() => {
                        if (
                          checkCfuSubmit(props.ptft, props.cfu) &&
                          allChecks(
                            props.provStudyplan,
                            props.incompatibilities,
                            props.courses,
                            props.studyplan.courses
                          )
                        ) {
                          props.postStudyplan(
                            props.provStudyplan.map((course) => course.code),
                            props.ptft
                          );
                        } else {
                          setTimeout(() => setErrorSubmit(""), 4000);
                        }
                      }}
                      variant="secondary"
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Container>
              <Row className="mt-10">
                {errorSubmit !== "" ? (
                  <Alert variant="danger" className="alert-submit">
                    {errorSubmit}
                  </Alert>
                ) : null}
              </Row>
            </Container>
          ) : (
            <></>
          )}

          {/*The studyplan already exist */}
        </>
      ) : (
        <Container fluid>
          <h2 className="title-allCourses">Study plan</h2>
          <>{props.studyplan.ptft === 1 ? "Part-time" : "Full-time"}</>
          <Row>
            <Col>
              <Table hover size="sm">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>CFU</th>
                  </tr>
                </thead>
                <tbody>
                  {props.studyplan.courses.map((course) => (
                    <CourseRow course={course} key={course.code} />
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>{cfu}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          {props.studyplan.courses.length !== 0 ? (
            <Button
              onClick={() => {
                props.setProvStudyplan(props.studyplan.courses);
                props.setCfu(sumCfu(props.studyplan.courses));
                props.setEditableMode(true);
              }}
              variant="secondary"
            >
              Edit
            </Button>
          ) : (
            <></>
          )}
        </Container>
      )}
    </>
  );
}

function CourseRow(props) {
  const [errorEnabled, setErrorEnabled] = useState(false);
  return (
    <>
      <tr>
        <td>{props.course.code}</td>
        <td>{props.course.name}</td>
        <td>{props.course.cfu}</td>
        {props.editableMode ? (
          <td>
            <BsFillTrashFill
              onClick={() => {
                if (isPropedeutic(props.provStudyplan, props.course)) {
                  props.setProvStudyplan((sp) =>
                    sp.filter((course) => course.code !== props.course.code)
                  );
                  props.setCfu((cfu) => cfu - props.course.cfu);
                } else {
                  setErrorEnabled(true);
                  setTimeout(() => setErrorEnabled(false), 2000);
                }
              }}
            ></BsFillTrashFill>
          </td>
        ) : null}
      </tr>
      {errorEnabled ? (
        <tr>
          <td colSpan={6}>
            {" "}
            <Alert variant="danger">
              {<span>You cannot remove a prerequisite course</span>}
            </Alert>
          </td>
        </tr>
      ) : (
        <></>
      )}
    </>
  );

  function isPropedeutic(provSP, course) {
    for (let index = 0; index < provSP.length; index++) {
      const element = provSP[index];
      if (element.proped === course.code) {
        return false;
      }
    }
    return true;
  }
}

function sumCfu(studyplan) {
  let cfu = 0;
  studyplan.forEach((course) => {
    cfu += course.cfu;
  });
  return cfu;
}
export { Studyplan };
