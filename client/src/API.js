const APIURL = new URL("http://localhost:3001/api/");

async function getAllCourses() {
  // call: GET /api/courses
  let err = new Error();
  const response = await fetch(new URL("courses", APIURL));
  if (response.ok) {
    const coursesJson = await response.json();
    return coursesJson.map((r) => ({
      code: r.code,
      name: r.name,
      cfu: r.cfu,
      maxStud: r.maxStud,
      proped: r.proped,
      numStud: r.numStud,
    }));
  } else {
    if (response.status === 500) {
      err.message = "500 INTERNAL SERVER ERROR";
      throw err;
    }
  }
}

async function getAllIncombatibilities() {
  // call: GET /api/incompatibilities
  let err = new Error();
  const response = await fetch(new URL("courses/incompatibilities", APIURL));
  if (response.ok) {
    const coursesJson = await response.json();
    return coursesJson.map((r) => ({
      mainCode: r.mainCode,
      incompCode: r.incompCode,
    }));
  } else {
    if (response.status === 500) {
      err.message = "500 INTERNAL SERVER ERROR";
      throw err;
    }
  }
}

async function getStudyPlan() {
  let err = new Error();
  const response = await fetch(new URL("studyplan", APIURL), {
    credentials: "include",
  });
  if (response.ok) {
    const studyplan = await response.json();
    return {
      courses: studyplan.courses.map((r) => ({
        code: r.code,
        name: r.name,
        cfu: r.cfu,
        maxStud: r.maxStud,
        proped: r.proped,
      })),
      ptft: studyplan.ptft,
    };
  } else {
    if (response.status === 500) {
      err.message = "500 INTERNAL SERVER ERROR";
      console.log(err);
      throw err;
    } else if (response.status === 401) {
      err.message = "401 UNAUTHORIZED";
      throw err;
    }
  }
}

async function getUserInfo() {
  const response = await fetch(new URL("sessions/current", APIURL), {
    credentials: "include",
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}

async function logIn(credentials) {
  let response = await fetch(new URL("sessions", APIURL), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(new URL("sessions/current", APIURL), {
    method: "DELETE",
    credentials: "include",
  });
}

async function postStudyplan(studyplan, ptft) {
  let err = new Error();
  const body = {
    courses: studyplan,
    ptft: ptft,
  };
  const response = await fetch(new URL("studyplan", APIURL), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    if (response.status === 500) {
      err.message = "500 INTERNAL SERVER ERROR";
      throw err;
    } else if (response.status === 422) {
      err.message = "422 UNPROCESSABLE ENTITY";
      throw err;
    } else if (response.status === 401) {
      err.message = "401 UNAUTHORIZED";
      throw err;
    } else {
      err.message = "OTHER ERROR";
      throw err;
    }
  }
}

async function deleteSP() {
  let err = new Error();
  const response = await fetch(new URL("studyplan/user/all", APIURL), {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 401) {
      err.message = "401 UNAUTHORIZED";
      throw err;
    } else if (response.status === 500) {
      err.message = "500 INTERNAL SERVER ERROR";
      throw err;
    }
  }
}

const API = {
  getAllCourses,
  getAllIncombatibilities,
  getUserInfo,
  logIn,
  logOut,
  getStudyPlan,
  postStudyplan,
  deleteSP,
};
export default API;
