
const clientID = '1dcb8eb3c86441729887db80d370669a';
const redirectUri = 'http://musicify.surge.sh';
let userID = ''
let accessToken;

function getAccessToken() {
    if (accessToken) {
        return accessToken;
    }
    // check for an access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    //checks to see if client token has already been granted
    if (accessTokenMatch && expiresInMatch) {
        accessToken = accessTokenMatch[1];

        const expiresIn = Number(expiresInMatch[1]);
        // This clears the parameters, allowing us to grab a new access token when it appears
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
    } else {
        //if client token has not been granted it redirects to spotify login page to get token
        const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessURL;
    }
}

const headers = { Authorization: `Bearer ${getAccessToken()}` };

const Spotify = {

    //makes a fetch to spotify api that will search for song/album/artist and returns json for app to render on searchResults component
    search(term) {
        // const accessToken = Spotify.getAccessToken();
        console.log(headers);
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
            { headers: headers })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return [];
                }
                console.log(jsonResponse);
                // console.log(jsonResponse.tracks.items);
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            })
    },

    //uses fetch and POST to upload the desired songs with desired album name to spotify
    savePlaylist(name, trackUris, uploadName) {
        if (!name || !trackUris.length) {
            return;
        }
        if (name !== 'Create New Playlist') {
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                })
                .then(response => response.json()
                ).then(jsonResponse => {
                    const playlistID = jsonResponse.id;
                    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
                        {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackUris })
                        })
                })
                .catch(e => {
                    console.log(e);
                });
        } else {
            return fetch(`https://api.spotify.com/v1/playlists/${uploadName}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris })
                })
        }
    },

    // uses a GET request to retrieve userID from spotify 
    getUserID() {
        if (userID.length !== 0) {
            return userID
        }
        else {
            return fetch('https://api.spotify.com/v1/me', { headers: headers })
                .then(response => response.json())
                .then(jsonResponse => {
                    userID = jsonResponse.id;
                });
        }

    },

    // get a list of the current playlists located in the users spotify account
    getUsersPlaylist() {
        return fetch(`https://api.spotify.com/v1/me/playlists`, { headers: headers })
            .then(response => {
                return response.json()
            })
            .then(jsonResponse => {
                console.log(jsonResponse)
                return jsonResponse.items.map(album => (
                    {
                        name: album.name,
                        id: album.id
                    }));
            })

    }
}
export default Spotify;