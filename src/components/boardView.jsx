import React from 'react'
import Board from '../js/board'
import Cell from './cell'
import TileView from './tileView'
import GameEndOverlay from './gameEndOverlay'
import Score from './score'
import Factory from '../js/factory'

require('../styles/main.scss')
require('../styles/style.scss')

class BoardView extends React.Component {
  restartGame = () => {
    let board = new Board()
    let ai = Factory.createAI(Factory.AI_DUMMY, board)
    this.setState({ board: board, ai: ai })
  }

  handleKeyDown = () => {
    if (this.state.board.hasWon()) {
      return
    }

    if (event.keyCode >= 37 && event.keyCode <= 40) {
      event.preventDefault()
      var direction = event.keyCode - 37
      this.setState({ board: this.state.board.move(direction) })
    }
  }

  handleTouchStart = (event) => {
    if (this.state.board.hasWon()) {
      return
    }
    if (event.touches.length != 1) {
      return
    }
    this.startX = event.touches[ 0 ].screenX
    this.startY = event.touches[ 0 ].screenY
    event.preventDefault()
  }

  handleTouchEnd = (event) => {
    if (this.state.board.hasWon()) {
      return
    }
    if (event.changedTouches.length != 1) {
      return
    }
    var deltaX = event.changedTouches[ 0 ].screenX - this.startX;
    var deltaY = event.changedTouches[ 0 ].screenY - this.startY;
    var direction = -1

    if (Math.abs(deltaX) > 3 * Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      direction = deltaX > 0 ? 2 : 0
    } else if (Math.abs(deltaY) > 3 * Math.abs(deltaX) && Math.abs(deltaY) > 30) {
      direction = deltaY > 0 ? 3 : 1
    }

    if (direction != -1) {
      this.setState({ board: this.state.board.move(direction) })
    }
  }

  handleAiClick = () => {
    this.state.ai.toggleAI()
  }

  componentDidMount () {
    document.body.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillMount () {
    this.restartGame()
  }

  componentWillUnmount () {
    document.body.removeEventListener('keydown', this.handleKeyDown)
  }

  render () {
    var cells = this.state.board.cells.map((row, index) => {
      return <div key={index}>{row.map((cell, index) => {
        return <Cell key={index}/>
      })}</div>
    })

    var tiles = this.state.board.tiles
      .filter(tile => {return tile.value !== 0})
      .map(tile => {return <TileView key={tile.id} tile={tile}/>})

    return (
      <div className='board' onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} tabIndex="1">
        {cells}
        {tiles}
        <GameEndOverlay board={this.state.board} ai={this.state.ai} onRestart={this.restartGame}/>
        <button onClick={this.handleAiClick}><i className='icon-robot'></i></button>
        <Score score={this.state.board.score}/>
      </div>
    )
  }
}

export default BoardView
