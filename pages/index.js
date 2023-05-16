import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";

import { Container, Card, Navbar, Nav } from "react-bootstrap";

const spotifyApi = new SpotifyWebApi();

function HomePage() {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const searchResult = await spotifyApi.searchTracks(
        `${songTitle} ${songArtist}`,
        { limit: 1 }
      );
      const track = searchResult.tracks.items[0];

      if (track.explicit === true) {
        setErrorMessage(
          `Sorry, "${track.name}" by ${track.artists[0].name} contains explicit content and cannot be added to the queue.`
        );
        setSuccessMessage("");
      } else {
        await spotifyApi.queue(track.uri);
        setSuccessMessage(
          `"${track.name}" by ${track.artist.name} has been added to the queue.`
        );
        setErrorMessage("");
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
      } else if (error.status === 403) {
        setErrorMessage(
          "Sorry, This account doesn't seem to have Spotify Premium. Thank Spotify!"
        );
        setSuccessMessage("");
      } else {
        setErrorMessage(
          "Sorry, there was an error adding your song to the queue. Please try again later."
        );
        setSuccessMessage("");
      }
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container mt-4">
        <Head>
          <title>Home - DJ</title>
        </Head>
        <h1>Welcome to my music stats website!</h1>
        <p>
          Please use the form below to suggest a song to be played, reminder I
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
      </div>
    </>
  );
}

export default HomePage;
