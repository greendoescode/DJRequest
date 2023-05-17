import { useState, useEffect } from "react";
import { Container, Card, Button, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function InboxPage() {
  const [songRequests, setSongRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/song-requests")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setErrorMessage("Failed to fetch song requests.");
        } else {
          setSongRequests(data);
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Failed to fetch song requests.");
      });
  }, []);



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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <h1>Inbox</h1>
        <div>
          {errorMessage && <p>{errorMessage}</p>}
          {songRequests.length === 0 && !errorMessage && (
            <p>No song requests found.</p>
          )}
          {songRequests.map((request) => (
            <Card key={request.id} className="my-3">
              <Card.Body>
                <Card.Title>{request.title}</Card.Title>
                <Card.Text>
                  <strong>Artist:</strong> {request.artist}
                </Card.Text>
                {request.comments && (
                  <Card.Text>
                    <strong>Comments:</strong> {request.comments}
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}

export default InboxPage;
