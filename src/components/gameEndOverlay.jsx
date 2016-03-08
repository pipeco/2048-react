import React from 'react'

class GameEndOverlay extends React.Component {
  render () {
    var board = this.props.board
    var contents = ''
    if (board.hasWon()) {
      contents = 'Good Job!'
      this.props.ai.stop()
    } else if (board.hasLost()) {
      contents = 'Game Over'
      this.props.ai.stop()
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