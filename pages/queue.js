import { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Card, Navbar, Nav } from 'react-bootstrap';

const spotifyApi = new SpotifyWebApi();

function QueuePage() {
  const [lastSong, setLastSong] = useState(null);
  const [upcomingSong, setUpcomingSong] = useState(null);
  const [totalSongs, setTotalSongs] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const getQueue = async () => {
      try {
        const queueResult = await spotifyApi.getMyCurrentPlaybackState();
        console.info(queueResult);
        const lastSongResult = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });
        const totalSongsResult = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });

        setLastSong(lastSongResult.items[0]);
        setUpcomingSong(queueResult);
        setTotalSongs(totalSongsResult.items.length);
      } catch (error) {
        if (error.status === 401) {
          console.error('API Returned Unauthorized, Getting Token.', error);
          try {
            const data = await fetch('/api/refresh-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            }).then((res) => res.json());
            if (data.accessToken) {
              spotifyApi.setAccessToken(data.accessToken);
              await getQueue();
            } else {
              setErrorMessage('Sorry, there was an error refreshing your access token. Please try again later.');
            }
          } catch (error) {
            setErrorMessage('Sorry, there was an error refreshing your access token. Please try again later.');
          }
        } else {
          setErrorMessage('Sorry, there was an error getting the queue. Please try again later.');
        }
      }
    };

    getQueue();
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-4">
        <Head>
          <title>Queue - DJ</title>
          <meta name="og:title" content="Current Info For My Music!" />
          <meta httpEquiv="refresh" content="30"></meta>
        </Head>
        <h1 className="text-left">Current Queue</h1>
        {lastSong && (
          <Card className="my-4 smaller-card">
            <Card.Body>
              <h2 className="h5">Last Song Played</h2>
              <div className="d-flex align-items-center">
                <a href={lastSong.track.external_urls.spotify} rel="noreferrer noopener" target="_blank">
                  <img
                    src={lastSong.track.album.images[0].url}
                    alt={lastSong.track.album.name}
                    className="rounded mr-3 img-thumbnail"
                    style={{ width: '50px', height: '50px' }}
                  />
                </a>
                <div>
                  <p className="m-2 fs-5">{lastSong.track.name}</p>
                  <p className="m-2 text-muted fs-6">{lastSong.track.artists[0].name}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
        {upcomingSong && (
          <Card className="my-4 smaller-card">
            <Card.Body>
              <h2 className="h5">Current Song</h2>
              <div className="d-flex align-items-center">
                <a href={upcomingSong.item.external_urls.spotify} rel="noreferrer noopener" target="_blank">
                  <img
                    src={upcomingSong.item.album.images[0].url}
                    alt={upcomingSong.item.album.name}
                    className="rounded mr-3 img-thumbnail"
                    style={{ width: '50px', height: '50px' }}
                  />
                </a>
                <div>
                  <p className="m-2 fs-5">{upcomingSong.item.name}</p>
                  <p className="m-2 text-muted fs-6">{upcomingSong.item.artists[0].name}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
        <div className="text-center">
          <h2 className="h6">Total Songs Played Today</h2>
          <p className="h4">{totalSongs}</p>
        </div>
        <div className="text-left">
          <h2 className="h6">Is shuffle on?</h2>
          <p className="h4">True</p>
        </div>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
      </Container>
    </>

);
}

export default QueuePage;