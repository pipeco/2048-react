import AI from './ai'

let randomMove = function () {
  let moves = this.board.possibleMoves()
  let move = Array.from(moves.values())[Math.floor(Math.random() * moves.size)]
  this.keyboard.dispatchEventsForAction(move, document.body)
  this.isMoving = true
}

class DummyAI extends AI {

  constructor (board) {
    super(board)
  }

  move () {
    if (this.isMoving) {
      return
    }

    this.interval = setInterval(randomMove.bind(this), 150)
  }
}

export default DummyAI