import React, { Component, Fragment } from 'react'
import ChipInput from 'material-ui-chip-input'
import Paper from '@material-ui/core/Paper'
import Tag from './Tag'
import tagNames from './tagNames'

const TagBar = props => {
  return (
    <Paper square style={{
      padding: 6,
    }}>
      {tagNames.map(tag => (<Tag name={tag} />))}
    </Paper>
  )
}

class DatumBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tagMenuOpen: false,
      tagValueMenuOpen: false,
      activeTag: null,
    }
  }
  render() {
    return (
      <Fragment>
        <ChipInput
          value={this.props.value}
          onAdd={this.props.onAddTag}
          onDelete={this.props.onDeleteTag}
          disableUnderline
          fullWidth
          InputProps={this.props.InputProps}
          chipRenderer={(
            {
              isFocused,
              handleClick,
              value,
            }, 
            key
          ) => (
            <Fragment key={key}>
              <Tag
                onClick={handleClick}
                nameValueString={value}
                isActiveDatumTag
                color={ isFocused ? 'secondary' : 'primary' }
              />
              <div style={{display: 'inline-block', width: 6}} />
            </Fragment>
          )}
          style={this.props.style}
        />
      </Fragment>
    )
  }
}

export default DatumBar