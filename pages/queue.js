import { useState, useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'

const spotifyApi = new SpotifyWebApi()

function QueuePage() {
    const [lastSong, setLastSong] = useState(null)
    const [upcomingSong, setUpcomingSong] = useState(null)
    const [totalSongs, setTotalSongs] = useState(0)
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
    }
  

  useEffect(() => {
    const getQueue = async () => {
      try {
        const queueResult = await spotifyApi.getMyCurrentPlaybackState()
        console.error(queueResult)
        const lastSongResult = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 })
        const totalSongsResult = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 })
  
        setLastSong(lastSongResult.items[0])
        setUpcomingSong(queueResult)
        setTotalSongs(totalSongsResult.items.length)
      } catch (error) {
        console.error(error)
        if (error.status === 401) {
          try {
            const data = await fetch('/api/refresh-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(res => res.json())
            console.log(data.accessToken)
            if (data.accessToken) {
              spotifyApi.setAccessToken(data.accessToken)
              await getQueue()
            } else {
              setErrorMessage('Sorry, there was an error refreshing your access token. Please try again later.')
            }
          } catch (error) {
            setErrorMessage('Sorry, there was an error refreshing your access token. Please try again later.')
          }
        } else {
          setErrorMessage('Sorry, there was an error getting the queue. Please try again later.')
        }
      }
    }

    getQueue()
  }, [])

  return (
    <div>
      <h1>Current Queue</h1>
      {lastSong && (
        <div>
          <h2>Last Song Played</h2>
          <p>{lastSong.track.name} by {lastSong.track.artists[0].name}</p>
        </div>
      )}
      {upcomingSong && (
        <div>
          <h2>Current Song</h2>
          <p>{upcomingSong.item.name} by {upcomingSong.item.artists[0].name}</p>
        </div>
      )}
    <div>
        <h2>Total Songs Played Today</h2>
        <p>Total songs played today: {totalSongs}</p>
    </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  )
}

export default QueuePage
