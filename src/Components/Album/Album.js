import React from 'react';
import './Album.css';

class Album extends React.Component{
    render(){
        return(
            <div className="Album">
                <div className="Album-information">
                    <h3>{this.props.name}</h3>
                </div>

            </div>
        );
    }
}

export default Album;