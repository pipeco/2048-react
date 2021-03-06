var id = 0

class Tile {
  constructor (value, row, column) {
    this.value = value || 0
    this.row = row || -1
    this.column = column || -1
    this.oldRow = -1
    this.oldColumn = -1
    this.markForDeletion = false
    this.mergedInto = null
    this.id = id++
  }

  isNew () {
    return this.oldRow === -1 && !this.mergedInto
  }

  hasMoved () {
    return (this.fromRow() !== -1 && (this.fromRow() !== this.toRow() || this.fromColumn() !== this.toColumn())) ||
      this.mergedInto
  }

  fromRow () {
    return this.mergedInto ? this.row : this.oldRow
  }

  fromColumn () {
    return this.mergedInto ? this.column : this.oldColumn
  }

  toRow () {
    return this.mergedInto ? this.mergedInto.row : this.row
  }

  toColumn () {
    return this.mergedInto ? this.mergedInto.column : this.column
  }
}

export default Tile
