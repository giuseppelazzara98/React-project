import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { MyNavbar } from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import "./App.css";
import API from "./API";
import { LoginForm } from "./components/LoginComponents";
import { Home } from "./components/Home";
import { Alert } from "react-bootstrap";

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}

function App2() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [courses, setCourses] = useState([]);
  const [studyplan, setStudyplan] = useState({});
  const [incompatibilities, setIncompatibilities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [editableMode, setEditableMode] = useState(false);
  const [provStudyplan, setProvStudyplan] = useState([]);
  const [ptft, setPtft] = useState(1);
  const [cfu, setCfu] = useState(0);
  const [reqSend, setReqSend] = useState(false);
  const navigate = useNavigate();

  function handleError(err) {
    setGeneralError(err.message);
  }
  const getStudyPlan = async () => {
    try {
      const studyplangetted = await API.getStudyPlan();
      setStudyplan(studyplangetted);
    } catch (err) {
      handleError(err);
    }
  };
  const postStudyplan = (studyplan, ptft) => {
    API.postStudyplan(studyplan, ptft)
      .then(() => {
        setReqSend((act) => !act);
        setProvStudyplan([]);
        setEditableMode(false);
      })
      .catch((err) => handleError(err));
  };
  const deleteSP = () => {
    API.deleteSP()
      .then(() => {
        setProvStudyplan([]);
        setEditableMode((act) => !act);
        setCfu(0);
        setReqSend((act) => !act);
      })
      .catch((err) => handleError(err));
  };
  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then((user) => {
        if (user) {
          setUser(user);
          getStudyPlan().then(() => setLoggedIn(true));
          navigate("/");
        }
      })
      .catch((err) => {
        setErrorMessage(err);
      });
  };

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setStudyplan({});
    setProvStudyplan([]);
    setEditableMode(false);
    setCfu(0);
  };

  useEffect(() => {
    const getStudyPlan = async () => {
      try {
        const studyplangetted = await API.getStudyPlan();
        setStudyplan(studyplangetted);
      } catch (err) {
        handleError(err);
      }
    };
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        return user; // user is logged in
      } catch (err) {
        return false; // user is not logged in
      }
    };
    const getAllCourses = async () => {
      try {
        const courses = await API.getAllCourses();
        setCourses(courses);
      } catch (err) {
        handleError(err);
      }
    };

    const getAllIncombatibilities = async () => {
      try {
        const incompatibilities = await API.getAllIncombatibilities();
        setIncompatibilities(incompatibilities);
      } catch (err) {
        handleError(err);
      }
    };

    checkAuth().then((user) => {
      if (user) {
        setUser(user);
        getStudyPlan().then(() => setLoggedIn(true));
      }
    });

    getAllCourses();
    getAllIncombatibilities();
  }, [reqSend]);

  return (
    <>
      <MyNavbar user={user} doLogOut={doLogOut}></MyNavbar>
      {generalError !== "" ? (
        <Alert variant="danger">{generalError}</Alert>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <Home
                ptft={ptft}
                cfu={cfu}
                setCfu={setCfu}
                courses={courses}
                incompatibilities={incompatibilities}
                editableMode={editableMode}
                setEditableMode={setEditableMode}
                studyplan={studyplan}
                setProvStudyplan={setProvStudyplan}
                provStudyplan={provStudyplan}
                loggedIn={loggedIn}
                setPtft={setPtft}
                user={user}
                postStudyplan={postStudyplan}
                deleteSP={deleteSP}
                reqSend={reqSend}
                setReqSend={setReqSend}
              />
            }
          />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/" />
              ) : (
                <LoginForm
                  login={doLogIn}
                  setErrorMessage={setErrorMessage}
                  errorMessage={errorMessage}
                />
              )
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;
