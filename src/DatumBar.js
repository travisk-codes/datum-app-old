import React, { Component, Fragment } from 'react'
import ChipInput from 'material-ui-chip-input'
import { withStyles } from '@material-ui/core/styles'

import Tag from './Tag'
import tagNames from './tagNames'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    position: 'fixed',
    //top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tag_bar: {
    backgroundColor: 'whitesmoke',
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2',
    padding: 8,
    position: 'relative',
    left: 0,
    right: 0,
    //bottom: 52, // TODO: stack on top of datum bar with flex somehow?
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  tag_bar_tag: {
    display: 'inline-flex',
    flex: '0 1 auto',
    margin: 2,
    backgroundColor: 'unset',
    color: 'red',
    border: '1px solid red',
  },
  datum_bar: {
    backgroundColor: 'whitesmoke',
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    //paddingTop: 10,
    //paddingBottom: 4,
    //paddingLeft: 6,
    //paddingRight: 6,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2',
  },
  datum_bar_input: {
    display: 'inline-flex',
    paddingLeft: 12,
    paddingTop: 2,
    paddingRight: 12,
    border: '1px dashed red',
    borderRadius: 16,
    fontSize: '0.8125rem',
    margin: 3,
  },
  hidden_span: {
    fontSize: '0.8125rem',
    padding: '0 13px',
    position: 'absolute',
    left: 0,
    bottom: 0,

  },
  test: {
    backgroundColor: 'pink',
  }
}

const TagBar = props => {
  const filtered_tags = tagNames.filter(tag => (
    tag.indexOf(props.filter) >= 0
  )).map((tag, i) => (
    <Tag
      onClick={() => props.onSelectTag(tag)}
      key={i}
      name={tag}
      variant='outlined'
      style={styles.tag_bar_tag}
    />
  ))
  return (
    <div style={{
      display: props.open && filtered_tags.length ? 'flex' : 'none',
      ...styles.tag_bar
    }}>
      {filtered_tags}
    </div>
  )
}

class DatumBar extends Component {
  constructor(props) {
    super(props)
    this.span = React.createRef()
    this.state = {
      tagMenuOpen: false,
      tagValueMenuOpen: false,
      activeTag: null,
      input_width: null,
      min_input_width: 32,
    }
    this.selectTag = this.selectTag.bind(this)
    this.render_chip = this.render_chip.bind(this)
  }
  componentDidMount() {
    this.setState({
      input_width: Math.max(this.span.current.offsetWidth, this.state.min_input_width)
    })
  }
  componentDidUpdate() {
    if (
      this.state.input_width !== Math.max(this.span.current.offsetWidth, this.state.min_input_width)
    ) {
      this.setState({
        input_width: Math.max(this.span.current.offsetWidth, this.state.min_input_width)
      })
    }
  }

  /*shouldComponentUpdate(nextProps, nextState) {
		if (
      this.props !== nextProps &&
      this.state !== nextState
    ) return true
		return false
	}*/

  selectTag(tag) {
    this.props.onAddTag(tag)
    this.setState({
      tagMenuOpen: false,
    })
  }

  render_chip(
    {
      isFocused,
      handleClick,
      value,
    }, 
    key
  ) {
    return (
      <Tag
        onClick={handleClick}
        nameValueString={value}
        isActiveDatumTag
        key={key}
        style={{display: 'inline-flex', margin: 3}}
      />
    )
  }

  render() {
    const { classes } = this.props
    return (
      <div style={styles.container}>
        <span style={styles.hidden_span} ref={this.span}>{this.props.InputProps.value}</span>
        <TagBar 
          open={this.state.tagMenuOpen}
          filter={this.props.InputProps.value}
          onSelectTag={this.selectTag}
        />
        <ChipInput
          onFocus={() => this.setState({tagMenuOpen: true})}
          value={this.props.value}
          onAdd={this.props.onAddTag}
          onDelete={this.props.onDeleteTag}
          disableUnderline
          fullWidth
          chipRenderer={this.render_chip}
          style={styles.datum_bar}
          classes={{chipContainer: classes.test}}
          InputProps={{
            ...this.props.InputProps,
            //classes: {root: classes.datum_bar_input},
            style: {
              ...styles.datum_bar_input,
              width: this.state.input_width,
            }
          }}
        />
      </div>
    )
  }
}

export default withStyles(styles)(DatumBar)