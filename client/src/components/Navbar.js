import { Navbar, Container, Button } from "react-bootstrap";
import { IoBookmarksOutline } from "react-icons/io5";
import { LogoutButton } from "./LoginComponents";
import { useNavigate } from "react-router-dom";
function MyNavbar(props) {
  const navigate = useNavigate();
  return (
    <Navbar bg="dark" variant="dark">
      

      <Container fluid>
      <Navbar.Brand>
        <IoBookmarksOutline
          className="navBarIcon"
          size={30}
        ></IoBookmarksOutline>
      </Navbar.Brand>
        <Navbar.Brand>
          <h3 className="navbar-title">StudyPlan Manager</h3>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {props.user.name ? (
              <span>
                Signed in as: {props.user.name}{" "}
                <LogoutButton logout={props.doLogOut} />
              </span>
            ) : (
              <Button variant="secondary" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export { MyNavbar };
