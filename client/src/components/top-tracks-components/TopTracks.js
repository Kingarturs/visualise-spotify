import React, { Component } from 'react';
import './TopTracks.css';
import {Spring} from 'react-spring/renderprops';
import { playOrPausePreview, autoplaySong, muteSong } from '../../helpers/TrackPreviewHelper.js';
import { Pie } from 'react-chartjs-2';

class TopTracks extends Component {
  constructor(){
    super();
    this.state = {
      topTracks: [],
      focusedSong: 0,
      timeframe: 'medium_term',
      titleTimeframe: 'The Last 6 Months',
      popularityChart:{
        datasets:[
          {
            data: [0, 0],
            backgroundColor: ["#0074D9"],
          },
        ],
      },
    }
  }

  componentDidMount(){
    this.getTopTracks(this.props.spotifyWebApi);
  }

  //Grabs the 10 most popular songs and pushes them into an array.
  //The 'tracks' state is then updated to add this new array.
  getTopTracks(spotifyWebApi){
    var tracks = []
    spotifyWebApi.getMyTopTracks({limit : 10, time_range: this.state.timeframe}).then((response) => {
      tracks = response.items;
      this.setState({
        topTracks: tracks,
        popularityChart:{
          datasets:[
            {
              data: [tracks[0].popularity, 100-tracks[0].popularity],
            },
          ],
        }
      })
    })
  }

  selectSong(track_index) {
    this.setState({
        focusedSong: track_index,
    })
  }

  getSongPopularity(popularity){
    this.setState({
      popularityChart:{
        datasets:[
          {
            data: [popularity, 100-popularity],
          },
        ],
      }
    });
  }

  selectTimeframe(timeframe){
    this.setState({
      timeframe: timeframe,
    })
    switch (timeframe) {
      case 'short_term':
        this.setState({
          titleTimeframe: 'The Last 4 Weeks',
        });
        this.getTopTracks(this.props.spotifyWebApi);
        break;
      case 'medium_term':
        this.setState({
          titleTimeframe: 'The Last 6 Months',
        });
        this.getTopTracks(this.props.spotifyWebApi);
        break;
      case 'long_term':
        this.setState({
          titleTimeframe: 'All Time',
        });
        this.getTopTracks(this.props.spotifyWebApi);
    }
  }

  render(){
    return (
      <div className="App">
        <div className="header">
          <p>Your Top 10 Songs of {this.state.titleTimeframe}</p>
        </div>
        <div className="row reverse-for-mobile">
          <div className="list-group col-md-3 topSongList margin-top">
            {this.state.topTracks.map((track) => (
              <button onClick={() => {this.getSongPopularity(track.popularity); this.selectSong(this.state.topTracks.indexOf(track));}} className="song-card" key={track.id}>
                {<img className="img-responsive float-left" src={track.album.images[0].url} style={{ width: 50 }} alt=""/>}
                <p className="song-card-text vertical-center">{track.name}</p>
              </button>
            ))}
          </div>

          <div className="col-sm-9 margin-top">
            {this.state.topTracks.slice(this.state.focusedSong,this.state.focusedSong+1).map((track) => (
              <div key={track.id} className="row">
                <Spring
                  from={{ opacity:0, marginTop: -500 }}
                  to={{ opacity:1, marginTop: 0 }}
                >
                  { props => (
                    <div style={props} className="col-lg-4">
                      <img className="img-responsive album-art" src={track.album.images[0].url} alt=""/>
                      <img className="overlay" onClick={() => { playOrPausePreview('song-preview');  }} src="https://image.flaticon.com/icons/svg/27/27185.svg" />
                    </div>
                  )}

                </Spring>
                <Spring
                  from={{ opacity:0 }}
                  to={{ opacity:1 }}
                >
                  { props => (
                    <div style={props} className="col-sm-8">
                      <div className="song-text song-text-container">
                        <h3>{track.name}</h3>
                        <h5>By: {track.artists[0].name}</h5>
                        <h5>Album: {track.album.name}</h5>
                        <audio id="song-preview">
                          <source src={track.preview_url} type="audio/ogg"/>
                        </audio>
                        <button onClick={() => muteSong('song-preview')}>
                          Mute
                        </button>
                      </div>
                    </div>
                  )}
                </Spring>
                <div class="dropdown">
                  <button class="dropdown-toggle btn-custom margin-bottom" type="button" data-toggle="dropdown"><div className="dropdown-text">Change Time Frame</div>
                  <span class="caret"></span></button>
                  <div class="alert alert-warning margin-left float-right">
                    Right now you must <strong>select</strong> the <strong>timeframe twice</strong> for it to work.
                  </div>
                  <div class="dropdown-menu text-center">
                    <a class="dropdown-item" href="#" onClick={() => { this.selectTimeframe('short_term'); }}>4 Weeks</a>
                    <a class="dropdown-item" href="#" onClick={() => { this.selectTimeframe('medium_term'); }}>6 Months</a>
                    <a class="dropdown-item" href="#" onClick={() => { this.selectTimeframe('long_term'); }}>All Time</a>
                  </div>
                </div>
              </div>
            ))}
            <div className="margin-top margin-bottom">
            <Pie
                data={this.state.popularityChart}
                options={{
                  title:{
                    display:true,
                    text:'Song Popularity',
                    fontSize:25,
                    fontColor:'#ffffff'
                  },
                  legend:{
                    display:false,
                    position:'right',
                    labels:{
                      fontColor:'#ffffff'
                    }
                  },
                  tooltips: {
                    callbacks: {
                      label: function(tooltipItem) {
                        return tooltipItem.yLabel;
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TopTracks;
