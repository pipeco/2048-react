import DummyAI from './ai/dummyAi'

class Factory {
  static createAI (type, board) {
    switch (type) {
      case Factory.AI_DUMMY:
        return new DummyAI(board)
      default:
        throw new Error('Invalid AI type ' + type)
    }
  }

  static get AI_DUMMY () {
    return 'Dummy'
  }
}

export default Factory