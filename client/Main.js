import React from 'react'
import axios from 'axios'
import AllAlbums from './AllAlbums'
import Player from './Player'
import SingleAlbum from './SingleAlbum'
import Sidebar from './Sidebar'
const audio = document.createElement('audio')

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: [],
      selectedAlbum: {}
    }
    this.handleClick = this.handleClick.bind(this)
    this.allAlbums = this.allAlbums.bind(this)
    this.playSong = this.playSong.bind(this)
  }

  async handleClick(event) {
    event.preventDefault()
    const currentId = event.currentTarget.id
    const currentAlbum = await axios.get(`/api/album/${currentId}`)
    this.setState({ selectedAlbum: currentAlbum.data })
  }

  allAlbums(event) {
    event.preventDefault()
    this.setState({ selectedAlbum: {} })
  }

  async playSong(event) {
    const songId = Number(event.currentTarget.id)
    const currentAlbum = await axios.get(`/api/album/${this.state.selectedAlbum.id}`)
    const songObj = currentAlbum.data.songs.filter(song => song.id === songId)
    audio.src = songObj[0].audioUrl 
      
    audio.load()
    audio.play()
  }

  async componentDidMount() {
    const albums = await axios.get('/api/album')
    this.setState({
      albums: albums.data
    })
  }

  render() {
    // console.log('our state', this.state.albums)
    return (
      <div id='main' className='row container'>
        <Sidebar allAlbums={this.allAlbums} />
        <div className='row container'>
          {this.state.selectedAlbum.id ? (
            <SingleAlbum
              handleClick={this.handleClick}
              songs={this.state.selectedAlbum.songs}
              artistName={this.state.selectedAlbum.artist.name}
              albumName={this.state.selectedAlbum.name}
              playSong={this.playSong}
            />
          ) : (
            this.state.albums.map((album) => (
              <AllAlbums
                key={album.id}
                id={album.id}
                album={album}
                handleClick={this.handleClick}
              />
            ))
          )}
        </div>
        <Player />
      </div>
    )
  }
}
