import { useState } from "react";
import { Container, Card, Form, Button, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const isLoggedIn = Cookies.get("isLoggedIn");

    if (isLoggedIn === true) {
      window.location.href = "/";
      return;
    }

    const lowercaseUsername = username.toLowerCase();

    // Send a request to the server to check the username and password
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: lowercaseUsername, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          Cookies.set("isLoggedIn", "true", { expires: 365, sameSite: 'true', secure: true });
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.error("Failed to login:", error);
        setErrorMessage("Failed to login. Please try again later.");
      });
  };

  return (
    <>
    <Navbar bg="dark" variant="dark" expand="md">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/queue">Current Queue</Nav.Link>
              <Nav.Link href="/inbox">Inbox</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    <Container>
      <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <Card style={{ width: "400px" }}>
          <Card.Body>
            <Card.Title>Login</Card.Title>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
              <Card.Text><a href="/signup">Sign Up</a></Card.Text>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  </>
  );
}

export default LoginPage;
