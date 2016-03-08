import {Keyboard} from 'keysim'

class AI {

  constructor (board) {
    this.board = board
    this.keyboard = Keyboard.US_ENGLISH
    this.isMoving = false
    this.interval = null
  }

  toggleAI () {
    this.isMoving ? this.stop() : this.move()
  }

  move () {
    // 'Abstract' method
  }

  stop () {
    if (!this.isMoving) {
      return
    }

    clearInterval(this.interval)
    this.isMoving = false
  }
}

export default AI
