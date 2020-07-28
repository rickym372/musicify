import React from 'react';
import Album from '../Album/Album';
import './UserPlaylist.css';

class UserPlaylist extends React.Component{
    render(){
        return(
            <div className="UserPlaylist">
                {
                this.props.album.map(album => {
                        return <Album name={album.name} key={album.id} />
                    })
                }
            </div>
        );
    }
}
export default UserPlaylist;