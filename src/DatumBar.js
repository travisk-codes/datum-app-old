import React, { Component, Fragment } from 'react'
import ChipInput from 'material-ui-chip-input'
import { withStyles } from '@material-ui/core/styles'

import Tag from './Tag'
import tagNames from './tagNames'
import { colors, color_numbers } from './utils/getTagColor'

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
  background: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.25,
  },
  tag_bar: {
    backgroundColor: 'whitesmoke',
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2',
    padding: 8,
    margin: 8,
    borderRadius: 8,
    position: 'relative',
    left: 0,
    right: 0,
    //bottom: 52, // TODO: stack on top of datum bar with flex somehow?
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  tag_bar_tag: {
    display: 'inline-flex',
    flex: '1 1 auto',
    margin: 2,
  },
  datum_bar: {
    backgroundColor: 'whitesmoke',
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2',
  },
  datum_bar_input: {
    display: 'inline-flex',
    flex: 'unset',
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

const rand_color = ()  => colors[Math.floor(Math.random()*colors.length)]

const TagBar = props => {
  const filtered_tags = tagNames.filter(tag => (
    tag.indexOf(props.filter) >= 0
  )).map((tag, i) => {
    const color = rand_color()[500]
    return (
      <Tag
        onClick={() => props.onSelectTag(tag)}
        key={i}
        name={tag}
        variant='outlined'
        style={{...styles.tag_bar_tag}}
      />
    )
  })
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
    this.onAddDatum = this.onAddDatum.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.render_chip = this.render_chip.bind(this)
    this.close_tag_menu_on_submit = this.close_tag_menu_on_submit.bind(this)
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
  }

  onAddDatum(e) {
    console.log('add datum!')
    if (e.target.value == '') this.setState({tagMenuOpen: false})
  }

  onAdd(input_value) {
    console.log(input_value)
    if (!input_value) console.log('nothing!')
    this.props.onAddTag(input_value)
  }

  onInputChange(e) {
    this.props.InputProps.onChange(e)
  }

  close_tag_menu_on_submit(e) {
    console.log(e.key)
    console.log(this.props.InputProps.value)
    if (
      e.key === 'Enter'
      && this.props.InputProps.value === ''
    ) this.setState({tagMenuOpen: false})
    if (
      e.key !== 'Enter' &&
      this.props.InputProps.value === ''
    ) this.setState({tagMenuOpen: true})
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
      <div 
        style={styles.container}
        onFocus={() => {this.setState({tagMenuOpen: true})}}
      >
        <span style={styles.hidden_span} ref={this.span}>{this.props.InputProps.value}</span>
        <div 
          style={{...styles.background, display: this.state.tagMenuOpen ? 'flex' : 'none'}} 
          onClick={() => this.setState({tagMenuOpen: false})}
        />
        <TagBar
          open={this.state.tagMenuOpen}
          filter={this.props.InputProps.value}
          onSelectTag={this.selectTag}
        />
        <ChipInput
          value={this.props.value}
          onAdd={this.onAdd}
          onDelete={this.props.onDeleteTag}
          disableUnderline
          fullWidth
          chipRenderer={this.render_chip}
          style={styles.datum_bar}
          classes={{chipContainer: classes.test}}
          onUpdateInput={() => console.log('update input!')}
          InputProps={{
            ...this.props.InputProps,
            onKeyPress: this.close_tag_menu_on_submit,
            onChange: this.onInputChange,
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