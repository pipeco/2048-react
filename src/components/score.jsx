import React from 'react'

class Score extends React.Component {
  shouldComponentUpdate (nextProps) {
    return this.props.score !== nextProps.score
  }

  render () {
    return (
      <span className='score'>Score: {this.props.score}</span>
    )
  }
}

export default Score