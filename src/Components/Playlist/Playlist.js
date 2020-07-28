import React from 'react';
import Tracklist from '../TrackList/TrackList';
import Select from 'react-select';
import './Playlist.css';


class Playlist extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePlaylistChange = this.handlePlaylistChange.bind(this);
    }
     handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    createOptions(){
        return this.props.userPlaylists.map(playlist=> ({
            value:playlist.id,
            label: playlist.name
        }))
    }

    handlePlaylistChange(optionSelected){
        const value = optionSelected.value;
        this.props.onPlaylistChange(value);
    }

    render(){
        return(
            <div className="Playlist">
                <input placeholder='Create New Playlist'
                    onChange={this.handleNameChange}
                    className='playlistInput'
                />
                <label>Or Save To Existing Playlist:</label>
                <Select
                    className='select'
                    options={this.createOptions()}
                    isSearchable
                    onChange={this.handlePlaylistChange.bind(this)}
                />
                
                <Tracklist tracks={this.props.playlistTracks}
                    onRemove={this.props.onRemove}
                    isRemoval={true} />

                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}
export default Playlist;    