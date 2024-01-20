import { useState, useEffect } from "react";
import { Container, Card, Button, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";


function InboxPage() {
  const [songRequests, setSongRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const isLoggedIn = Cookies.get("isLoggedIn");
    const username = Cookies.get("user_id");

    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

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

  const handleLogout = () => {
    Cookies.remove("isLoggedIn");
    window.location.href = "/login";
  };

  const isLoggedIn = Cookies.get("isLoggedIn");

  const handleDelete = (id) => {
    fetch("/api/song-requests", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setErrorMessage("Failed to delete song request.");
        } else {
          // Update the songRequests state after successful deletion
          setSongRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== id)
          );
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Failed to delete song request.");
      });
  };

  if (!isLoggedIn) {
    return null;
  }

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
                <Card.Text>
                  <strong>
                    <a
                      target="_blank"
                      className="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                      href={
                        "https://www.youtube.com/results?search_query=" +
                        request.title +
                        " " +
                        request.artist
                      }
                      rev="Download song here!"
                    >
                      Download here!
                    </a>
                  </strong>
                </Card.Text>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(request.id)}
                  className="mr-2"
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}

export default InboxPage;
