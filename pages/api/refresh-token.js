import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: "4a8cd4a6e0e842008152297f6616e49f",
  clientSecret: "5832ec49d8a04acda4d3daa885a3a41a",
  redirectUri: 'http://localhost:3000/callback'
})

var code = "AQC3lH-wrGbU9n-Ey2e1ZQRdPRbldBWjf4AVSBhnj38Pp7nSRHsoLdtmgPATnMruE5HCzAisThG-o7HeOHjyEqeJI22lSFNBIBUcLcpsWUtwbZ2GZ_Im47Dr8TjuWeDeg_8"

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

