import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: "4a8cd4a6e0e842008152297f6616e49f",
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/callback'
})

var code = process.env.CALLBACK_CODE

export default async function handler(req, res) {
    try {
      const data = spotifyApi.authorizationCodeGrant(code).then(
        function(data) {
        console.warn(data.body['refresh_token'])
        res.status(200).json({ accessToken: data.body.access_token, refreshToken: data.body.refresh_token })
        }
      )
      
    } catch (error) {
      console.error(error)  
      res.status(400).json({ message: 'Failed to refresh access token' })
    }
  }

