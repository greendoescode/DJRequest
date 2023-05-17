import { useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { useRouter } from "next/router";
import { Container, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

const spotifyApi = new SpotifyWebApi();

function HomePage() {
  const router = useRouter();
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songComments, setSongComments] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSongTitleChange = (event) => {
    setSongTitle(event.target.value);
  };

  const handleSongArtistChange = (event) => {
    setSongArtist(event.target.value);
  };

  const handleSongCommentsChange = (event) => {
    setSongComments(event.target.value);
  };
  
  const isLoggedIn = Cookies.get("isLoggedIn");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send the song request data to the backend API
      const searchResult = await spotifyApi.searchTracks(
        `${songTitle} ${songArtist}`,
        { limit: 1 }
      );
      const track = searchResult.tracks.items[0];
      
      if (!isLoggedIn) {
        setErrorMessage("Sorry, you must be logged in to submit a recommendation!")
        setSuccessMessage("");
      } else if (track.explicit === true) {
        setErrorMessage(
          `Sorry, "${track.name}" by ${track.artists[0].name} contains explicit content and cannot be added to the queue.`
        );
        setSuccessMessage("");
      } else {
        const response = await fetch("/api/song-requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: songTitle,
            artist: songArtist,
            comments: songComments,
          }),
        });
        if (response.ok) {
          setSuccessMessage("Song request added successfully!");
          setErrorMessage("");
          setSongTitle("");
          setSongArtist("");
          setSongComments("");
        } else {
          setErrorMessage(
            "Sorry, there was an error adding your song request. Please try again later."
          );
          setSuccessMessage("");
        }
      }
    } catch (error) {
      if (error.status === 401) {
        console.error("API Returned Unauthorized, Getting Token.", error);
        try {
          const data = await fetch("/api/refresh-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => res.json());
          if (data.accessToken) {
            spotifyApi.setAccessToken(data.accessToken);
            await getQueue();
          } else {
            setErrorMessage(
              "Sorry, there was an error refreshing your access token. Please try again."
            );
          }
        } catch (error) {
          setErrorMessage(
            "Sorry, there was an error refreshing your access token. Please try again."
          );
        }
      } else {
        setErrorMessage("Sorry, there was an error adding your song request. Please try again later.");
        setSuccessMessage("");
      }  
      console.error(error);
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
      <Container className="mt-4">
        <h1>Welcome to my music stats website!</h1>
        <p>
          Please use the form below to suggest a song to be played. Note that I
          normally listen to music locally.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="songTitle" className="form-label">
              Song Title:
            </label>
            <input
              type="text"
              className="form-control"
              id="songTitle"
              value={songTitle}
              onChange={handleSongTitleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="songArtist" className="form-label">
              Song Artist:
            </label>
            <input
              type="text"
              className="form-control"
              id="songArtist"
              value={songArtist}
              onChange={handleSongArtistChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="songComments" className="form-label">
              Comments:
            </label>
            <textarea
              className="form-control"
              id="songComments"
              value={songComments}
              onChange={handleSongCommentsChange}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </Container>
    </>
  );
}

export default HomePage;
