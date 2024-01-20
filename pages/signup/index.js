import { useState } from "react";
import { Container, Card, Form, Button, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage("User registered successfully");
    } else {
      setErrorMessage(data.error || "Failed to register user");
    }
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
            <Card.Title>Signup</Card.Title>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <Form onSubmit={handleSignup}>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>
              <Button variant="primary" type="submit">
                Signup
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>  
    </Container>
  </>
  );
}

export default SignupPage;
