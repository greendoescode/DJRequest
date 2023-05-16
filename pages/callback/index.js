import SpotifyWebApi from "spotify-web-api-js";
import { useRouter } from "next/router";

const spotifyApi = new SpotifyWebApi({
  clientId: "4a8cd4a6e0e842008152297f6616e49f",
  redirectUri: "http://localhost:3000/callback",
});

function Callback() {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "ugc-image-upload",
    "user-top-read",
    "user-read-playback-state",
    "user-read-currently-playing",
    "app-remote-control",
    "streaming",
    "playlsit-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-public",
    "user-folow-modify",
    "user-follow-read",
    "user-read-playback-position",
    "user-top-read",
    "user-read-recently-played",
    "user-libary-modify",
    "user-libary-read",
    "user-soa-link",
    "user-soa-unlink",
    "user-manage-entitlements",
    "user-manage-partner",
    "user-create-partner",
  ];

  function handleLogin() {
    const url = spotifyApi.createAuthorizeURL(scopes);
    window.location = url;
  }

  return <div>Callback Page</div>;
}

export default Callback;
