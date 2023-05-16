import { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'

const spotifyApi = new SpotifyWebApi()

function HomePage() {
  const [songTitle, setSongTitle] = useState('')
  const [songArtist, setSongArtist] = useState('')
  const [songComments, setSongComments] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSongTitleChange = (event) => {
    setSongTitle(event.target.value)
  }

  const handleSongArtistChange = (event) => {
    setSongArtist(event.target.value)
  }

  const handleSongCommentsChange = (event) => {
    setSongComments(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const searchResult = await spotifyApi.searchTracks(`${songTitle} ${songArtist}`, { limit: 1 })
      const track = searchResult.tracks.items[0]
      console.info(track)

      if (track.explicit === true) {
        setErrorMessage(`Sorry, "${track.name}" by ${track.artists[0].name} contains explicit content and cannot be added to the queue.`)
        setSuccessMessage('')
      } else {
        await spotifyApi.queue(track.uri)
        setSuccessMessage(`"${track.name}" by ${track.artist.name} has been added to the queue.`)
        setErrorMessage('')
      }
    } catch (error) {
        if (error.status === 401) {
          console.error("API Returned Unauthorized, Getting Token.",error)
            try {
              const data = await fetch('/api/refresh-token', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then(res => res.json())
              if (data.accessToken) {
                spotifyApi.setAccessToken(data.accessToken)
                await getQueue()
              } else {
                setErrorMessage('Sorry, there was an error refreshing your access token. Please try again later.')
              }
            } catch (error) {
              setErrorMessage('Sorry, there was an error refreshing your access token. Please try again later.')
            }
      } else if (error.status === 403){
        setErrorMessage("Sorry, This account doesn't seem to have Spotify Premuim. Thank Spotify!")
        setSuccessMessage('')
      } else {
        setErrorMessage('Sorry, there was an error adding your song to the queue. Please try again later.')
        setSuccessMessage('')
      }
    }
  }

  return (
    <div>
      <h1>Welcome to the DJ request website!</h1>
      <p>Please use the form below to suggest a song to be played.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="songTitle">Song Title:</label>
          <input type="text" id="songTitle" value={songTitle} onChange={handleSongTitleChange} required />
        </div>
        <div>
          <label htmlFor="songArtist">Song Artist:</label>
          <input type="text" id="songArtist" value={songArtist} onChange={handleSongArtistChange} required />
        </div>
        <div>
          <label htmlFor="songComments">Comments:</label>
          <textarea id="songComments" value={songComments} onChange={handleSongCommentsChange}></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  )
}

export default HomePage
