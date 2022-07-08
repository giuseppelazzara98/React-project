import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

function LoginForm(props) {
  const [username, setUsername] = useState("chad.smith");
  const [password, setPassword] = useState("test");

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setErrorMessage((r) => (r = ""));
    const credentials = { username, password };
    let valid = true;
    if (username === "" || password === "") valid = false;

    if (valid) {
      props.login(credentials);
    } else {
      props.setErrorMessage((r) => (r = "Username and/or password invalid."));
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col></Col>
        <Col>
          <Row>
            <Col>
              <h1>Login</h1>
              <h2>Welcome to Studyplan Manager</h2>
              <span>
                Insert your credentials to access and view or create your new
                studyplan
              </span>
              <Form onSubmit={handleSubmit}>
                {props.errorMessage ? (
                  <Alert variant="danger">{props.errorMessage}</Alert>
                ) : (
                  ""
                )}
                <Row>
                  <Col>
                    <Form.Group controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="username"
                        value={username}
                        onChange={(ev) => setUsername(ev.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group align="center">
                  <Button className="mt-1" variant="secondary" type="submit">
                    Login
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

function LogoutButton(props) {
  return (
    <Col>
      <Button
        className="logout-button"
        size="sm"
        variant="outline-secondary"
        onClick={props.logout}
      >
        Logout
      </Button>
    </Col>
  );
}

export { LoginForm, LogoutButton };
