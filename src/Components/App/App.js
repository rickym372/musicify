import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],

      //state. playlist Name 
      playlistName: 'Create New Playlist',

      //state. playlist Tracks
      playlistTracks: [],

      userPlaylists: [],

      upload: 'none',

      userID: ''
    };

    // this is where we bind all the methods that change the state of the program
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getUsersPlaylist = this.getUsersPlaylist.bind(this);
    this.updatePlaylistChoice = this.updatePlaylistChoice.bind(this);

  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    let newPlaylistTracks = tracks.filter(savedTrack => savedTrack.id !== track.id)
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  async savePlaylist() {
    let trackUris = this.state.playlistTracks.map(track => track.uri);
    if (!this.state.userID) {
      this.setState({
        userID: await Spotify.getUserID()
      })
    }
    Spotify.savePlaylist(this.state.playlistName, trackUris, this.state.upload)
      .then(() => {
        this.setState({
          playlistName: 'Create New Playlist',
          playlistTracks: []
        })
      });
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    });
    this.getUsersPlaylist();
  }

  getUsersPlaylist() {
    Spotify.getUsersPlaylist()
      .then(results => {
        this.setState({ userPlaylists: results })
      })
  }

  updatePlaylistChoice(id) {
    this.setState({
      upload: id
    })

  }

  render() {
    return (
      <div>
        <h1>music<span className="highlight">IFY</span></h1>
        <div className="App">

          <SearchBar onSearch={this.search} />

          <div className="App-playlist">

            <SearchResults searchResults={this.state.searchResults}
              onAdd={this.addTrack} />


            <Playlist playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              userPlaylists={this.state.userPlaylists}
              onPlaylistChange={this.updatePlaylistChoice}
            />

          </div>
        </div>
      </div>
    )
  }
}

export default App;
