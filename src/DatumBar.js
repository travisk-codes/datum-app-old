import React, { Component, Fragment } from 'react'
import ChipInput from 'material-ui-chip-input'
import Tag from './Tag'
import tagNames from './tagNames'

const TagBar = props => (
  <div style={{
    backgroundColor: 'whitesmoke',
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2',
    padding: 8,
    display: props.open ? 'flex' : 'none',
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 52,
    flexWrap: 'wrap',
    justifyContent: 'center'
  }}>
    {tagNames.filter(tag => (
      tag.indexOf(props.filter) >= 0
    )).map((tag, i) => (
      <Tag
        onClick={props.onSelectTag}
        key={i}
        name={tag}
        style={{
          display: 'inline-flex',
          flex: '0 1 auto',
          margin: 2,
        }}
      />
     ))}
  </div>
)

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
        <TagBar 
          open={this.state.tagMenuOpen}
          filter={this.props.InputProps.value}
          onSelectTag={this.props.onAddTag}
        />
        <ChipInput
          onFocus={() => this.setState({tagMenuOpen: true})}
          onBlur={() => this.setState({tagMenuOpen: false})}
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
          style={{
            backgroundColor: 'whitesmoke',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            paddingTop: 10,
            paddingBottom: 4,
            paddingLeft: 6,
            boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2',
          }}
        />
      </Fragment>
    )
  }
}

export default DatumBar