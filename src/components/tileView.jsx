import React from 'react'
import ClassNames from 'classnames'

class TileView extends React.Component {
  shouldComponentUpdate (nextProps) {
    return this.props.tile !== nextProps.tile || nextProps.tile.hasMoved() || nextProps.tile.isNew()
  }

  render () {
    var tile = this.props.tile
    var classArray = [ 'tile' ]
    classArray.push('tile' + this.props.tile.value)
    if (!tile.mergedInto) {
      classArray.push('position_' + tile.row + '_' + tile.column)
    }

    if (tile.mergedInto) {
      classArray.push('merged')
    }

    if (tile.isNew()) {
      classArray.push('new')
    }

    if (tile.hasMoved()) {
      classArray.push('row_from_' + tile.fromRow() + '_to_' + tile.toRow())
      classArray.push('column_from_' + tile.fromColumn() + '_to_' + tile.toColumn())
      classArray.push('isMoving')
    }

    var classes = ClassNames(classArray)
    return (
      <span className={classes} key={tile.id}>{tile.value}</span>
    )
  }
}

export default TileView