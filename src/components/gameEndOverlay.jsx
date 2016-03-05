import React from 'react'

class GameEndOverlay extends React.Component {
  render () {
    var board = this.props.board
    var contents = ''
    if (board.hasWon()) {
      contents = 'Good Job!'
    } else if (board.hasLost()) {
      contents = 'Game Over'
    }

    if (!contents) {
      return null;
    }

    return (
      <div className='overlay'>
        <p className='message'>{contents}</p>
        <button className="tryAgain" onClick={this.props.onRestart} onTouchEnd={this.props.onRestart}>Try again</button>
      </div>
    )
  }
}

export default GameEndOverlay