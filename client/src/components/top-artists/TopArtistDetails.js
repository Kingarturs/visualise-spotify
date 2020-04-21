import React, { Component } from 'react';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab';
import { playOrPausePreview } from '../../helpers/TrackPreviewHelper.js';

/**
 * Responsible for displaying the details for the currently selected artist
 * */
class TopArtistDetails extends Component {
    constructor() {
        super();
        this.state = {
            dataHasLoaded: false
        }
    }

    //Helper function to set whether the data has been loaded
    setDataHasLoaded = (hasLoaded) => {
        this.setState({
            dataHasLoaded: hasLoaded
        })
    }

    //Action to make the user follow a given artist
    followArtist = (artistId) => {
        this.setDataHasLoaded(false);
        this.props.spotifyWebApi.followArtists([artistId])
            .then(() => {
                this.setDataHasLoaded(true);
                this.props.checkFollowingArtist(artistId);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    //Action to make the user unfollow a given artist
    unfollowArtist = (artistId) => {
        this.setDataHasLoaded(false);
        this.props.spotifyWebApi.unfollowArtists([artistId])
            .then(() => {
                this.setDataHasLoaded(true);
                this.props.checkFollowingArtist(artistId);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    render() {
        return (
            <div className="artistDetails">
                <div className="mainAlbumContainer">
                    <img className="mainAlbumArt" src={this.props.artistImage} alt="album art" />
                    <div className="startStopContainer">
                        <img alt="start/stop icon" className="startStop" onClick={() => { playOrPausePreview('artist-top-song-preview' + this.state.selectedArtist) }} src="https://image.flaticon.com/icons/svg/27/27185.svg" />
                    </div>
                </div>
                <div>
                    <h2>{this.props.artistName}</h2>
                    {this.props.isFollowingArtist &&
                        <div>
                            <p>You are one of {this.props.artistName}'s {this.props.followers} followers!</p>
                            <div id="action-button" onClick={() => this.unfollowArtist(this.props.artistId)}> Unfollow :( </div>
                        </div>
                    }
                    {!this.props.isFollowingArtist &&
                        <div>
                            <p>{this.props.artistName} have {this.props.followers} followers. Follow now?</p>
                            <div id="action-button" onClick={() => this.followArtist(this.props.artistId)}> Follow </div>
                        </div>
                    }
                </div>
                <Tabs defaultActiveKey="genres" id="arist-details-tabs" className="aristDetailsTabs">
                    <Tab eventKey="genres" title="Genres" className="artistTabContent">
                        {this.props.genres.map((genre) => (
                            <li>{genre}</li>
                        ))}
                    </Tab>
                    <Tab eventKey="similarArtists" title="Similar Artists" className="artistTabContent row">
                        <div className="similarArtists">
                            {this.props.similarArtists.map((similarArtist) => (
                                <div className="similarArtistAlbumArt">
                                    <img src={similarArtist.images[0].url} alt="album art" />
                                    <p><a href={similarArtist.external_urls.spotify}>{similarArtist.name}</a></p>
                                </div>
                            ))}
                        </div>
                    </Tab>
                </Tabs>

                <audio ref="song" id={"artist-top-song-preview" + this.state.selectedArtist}>
                    <source src={this.props.previewUrl} type="audio/ogg" />
                </audio>
            </div>
        );
    }
}

export default TopArtistDetails;