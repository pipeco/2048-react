import Tile from './tile'

function rotateLeft (matrix) {
  let rows = matrix.length
  let columns = matrix[ 0 ].length
  let res = []
  for (let row = 0; row < rows; ++row) {
    res.push([])
    for (let column = 0; column < columns; ++column) {
      res[ row ][ column ] = matrix[ column ][ columns - row - 1 ]
    }
  }
  return res
}

const SIZE = 4
const FOUR_PROBABILITY = 0.1
const DELTA_X = [ -1, 0, 1, 0 ]
const DELTA_Y = [ 0, -1, 0, 1 ]

class Board {

  constructor () {
    this.won = false
    this.score = 0

    this.tiles = []
    this.cells = []

    for (let i = 0; i < SIZE; ++i) {
      this.cells[ i ] = [ this.addTile(), this.addTile(), this.addTile(), this.addTile() ]
    }

    this.addRandomTile()
    this.setPositions()
  }

  addTile () {
    let res = new Tile()
    Tile.apply(res, arguments)
    this.tiles.push(res)
    return res
  }

  addRandomTile () {
    let emptyCells = []
    for (let r = 0; r < SIZE; ++r) {
      for (let c = 0; c < SIZE; ++c) {
        if (this.cells[ r ][ c ].value === 0) {
          emptyCells.push({ r: r, c: c })
        }
      }
    }
    let index = ~~(Math.random() * emptyCells.length)
    let cell = emptyCells[ index ]
    let newValue = Math.random() < FOUR_PROBABILITY ? 4 : 2
    this.cells[ cell.r ][ cell.c ] = this.addTile(newValue)
  }

  setPositions () {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        tile.oldRow = tile.row
        tile.oldColumn = tile.column
        tile.row = rowIndex
        tile.column = columnIndex
        tile.markForDeletion = false
      })
    })
  }

  moveLeft () {
    let hasChanged = false
    for (let row = 0; row < SIZE; ++row) {
      let currentRow = this.cells[ row ].filter(tile => { return tile.value !== 0 })
      let resultRow = []

      for (let target = 0; target < SIZE; ++target) {
        let targetTile = currentRow.length ? currentRow.shift() : this.addTile()
        if (currentRow.length > 0 && currentRow[ 0 ].value === targetTile.value) {
          let tile1 = targetTile
          targetTile = this.addTile(targetTile.value)
          tile1.mergedInto = targetTile
          this.score += tile1.value

          let tile2 = currentRow.shift()
          tile2.mergedInto = targetTile
          targetTile.value += tile2.value
          this.score += tile2.value
        }

        resultRow[ target ] = targetTile
        this.won |= (targetTile.value === 2048)
        hasChanged |= (targetTile.value !== this.cells[ row ][ target ].value)
      }

      this.cells[ row ] = resultRow
    }
    return hasChanged
  }

  move (direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles()
    for (let i = 0; i < direction; ++i) {
      this.cells = rotateLeft(this.cells)
    }
    let hasChanged = this.moveLeft()
    for (let i = direction; i < 4; ++i) {
      this.cells = rotateLeft(this.cells)
    }

    if (hasChanged) {
      this.addRandomTile()
    }

    this.setPositions()
    return this
  }

  clearOldTiles () {
    this.tiles = this.tiles.filter(tile => { return tile.markForDeletion === false })
    this.tiles.forEach(tile => { tile.markForDeletion = true })
  }

  hasWon () {
    return this.won
  }

  possibleMoves () {
    let moves = new Set()

    let matrix = []
    for (let row = 0; row < SIZE; ++row) {
      matrix.push([])
      for (let column = 0; column < SIZE; ++column) {
        matrix[ row ].push(this.cells[ row ][ column ].value)
      }
    }

    for (let row = 0; row < SIZE; row++) {
      for (let column = 0; column < SIZE; column++) {
        var value = matrix[ row ][ column ]
        if ((column > 0 && value !== 0) && (matrix[ row ][ column - 1 ] === 0 || matrix[ row ][ column - 1 ] === value)) {
          moves.add('left')
        }

        if ((column < 3 && value !== 0) && (matrix[ row ][ column + 1 ] === 0 || matrix[ row ][ column + 1 ] === value)) {
          moves.add('right')
        }

        if ((row > 0 && value !== 0) && (matrix[ row - 1 ][ column ] === 0 || matrix[ row - 1 ][ column ] === value)) {
          moves.add('up')
        }

        if ((row < 3 && value !== 0) && (matrix[ row + 1 ][ column ] === 0 || matrix[ row + 1 ][ column ] === value)) {
          moves.add('down')
        }
      }
    }

    return moves
  }

  hasLost () {
    let moves = this.possibleMoves()
    return moves.size === 0
  }
}

export default Board
