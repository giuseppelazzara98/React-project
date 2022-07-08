import { Courses } from "./CoursesComponent";
import { Studyplan } from "./Studyplan";
import { Row, Col } from "react-bootstrap";

function Home(props) {
  return (
    <>
      {props.loggedIn && Object.keys(props.studyplan) ? (
        <>
          <Row>
            <Col>
              <Courses
                ptft={props.ptft}
                cfu={props.cfu}
                setCfu={props.setCfu}
                courses={props.courses}
                incompatibilities={props.incompatibilities}
                editableMode={props.editableMode}
                setEditableMode={props.setEditableMode}
                setProvStudyplan={props.setProvStudyplan}
                provStudyplan={props.provStudyplan}
                studyplan={props.studyplan}
              >
                {" "}
              </Courses>
            </Col>
            <Col>
              <Studyplan
                isLoggedIn={props.loggedIn}
                ptft={props.ptft}
                setPtft={props.setPtft}
                cfu={props.cfu}
                setCfu={props.setCfu}
                studyplan={props.studyplan}
                provStudyplan={props.provStudyplan}
                incompatibilities={props.incompatibilities}
                setProvStudyplan={props.setProvStudyplan}
                user={props.user}
                editableMode={props.editableMode}
                setEditableMode={props.setEditableMode}
                courses={props.courses}
                postStudyplan={props.postStudyplan}
                deleteSP={props.deleteSP}
                reqSend={props.reqSend}
                setReqSend={props.setReqSend}
              />
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Courses
            courses={props.courses}
            incompatibilities={props.incompatibilities}
            setErrorMessage={props.setErrorMessage}
            errorMessage={props.errorMessage}
            studyplan={props.studyplan}
          ></Courses>
        </>
      )}
    </>
  );
}
export { Home };
