import React from 'react';
import './CurrentPlaylist.css';
import UserPlaylist from '../UsersPlaylist/UserPlaylist';
class CurrentPlaylist extends React.Component{
    render(){
        return(
            <div className="CurrentPlaylist">
                <h2>Users Existing Playlists</h2>
                <UserPlaylist album={this.props.album} />
                
            </div>
        );
    }
}

export default CurrentPlaylist;