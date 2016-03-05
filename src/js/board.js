import Tile from './tile'

function rotateLeft (matrix) {
  var rows = matrix.length
  var columns = matrix[ 0 ].length
  var res = []
  for (var row = 0; row < rows; ++row) {
    res.push([])
    for (var column = 0; column < columns; ++column) {
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

    this.tiles = []
    this.cells = []

    for (var i = 0; i < SIZE; ++i) {
      this.cells[ i ] = [ this.addTile(), this.addTile(), this.addTile(), this.addTile() ]
    }

    this.addRandomTile()
    this.setPositions()
  }

  addTile () {
    var res = new Tile()
    Tile.apply(res, arguments)
    this.tiles.push(res)
    return res
  }

  addRandomTile () {
    var emptyCells = []
    for (var r = 0; r < SIZE; ++r) {
      for (var c = 0; c < SIZE; ++c) {
        if (this.cells[ r ][ c ].value === 0) {
          emptyCells.push({ r: r, c: c })
        }
      }
    }
    var index = ~~(Math.random() * emptyCells.length)
    var cell = emptyCells[ index ]
    var newValue = Math.random() < FOUR_PROBABILITY ? 4 : 2
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
    var hasChanged = false
    for (var row = 0; row < SIZE; ++row) {
      var currentRow = this.cells[ row ].filter(tile => { return tile.value !== 0 })
      var resultRow = []

      for (var target = 0; target < SIZE; ++target) {
        var targetTile = currentRow.length ? currentRow.shift() : this.addTile()
        if (currentRow.length > 0 && currentRow[ 0 ].value === targetTile.value) {
          var tile1 = targetTile
          targetTile = this.addTile(targetTile.value)
          tile1.mergedInto = targetTile
          var tile2 = currentRow.shift()
          tile2.mergedInto = targetTile
          targetTile.value += tile2.value
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
    for (var i = 0; i < direction; ++i) {
      this.cells = rotateLeft(this.cells)
    }
    var hasChanged = this.moveLeft()
    for (i = direction; i < 4; ++i) {
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

  hasLost () {
    var canMove = false
    for (var row = 0; row < SIZE; ++row) {
      for (var column = 0; column < SIZE; ++column) {
        canMove |= (this.cells[ row ][ column ].value === 0)

        for (var dir = 0; dir < 4; ++dir) {
          var newRow = row + DELTA_X[ dir ]
          var newColumn = column + DELTA_Y[ dir ]
          if (newRow < 0 || newRow >= SIZE || newColumn < 0 || newColumn >= SIZE) {
            continue
          }

          canMove |= (this.cells[ row ][ column ].value === this.cells[ newRow ][ newColumn ].value)
        }
      }
    }
    return !canMove
  }
}

export default Board
