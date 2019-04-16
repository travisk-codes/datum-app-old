import React, { Component } from 'react'
import ChipInput from 'material-ui-chip-input'
import { withStyles } from '@material-ui/core/styles'

import Tag from './Tag'
import tag_names from './tagNames'

const styles = {
  container: {
    display: 'flex',
    position: 'fixed',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    left: 0,
    right: 0,
    bottom: 0,
  },
  dimmed_background: {
    // display: controlled
    position: 'fixed',
    width: '100%',
    height: '100%',

    backgroundColor: 'black',
    opacity: 0.25,
  },
  tag_menu: {
    // display: controlled
    position: 'relative',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 8,
    margin: 8,
    left: 0,
    right: 0,

    backgroundColor: 'whitesmoke',
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2',
    borderRadius: 8,
  },
  tag_menu_tag: {
    display: 'inline-flex',
    position: 'relative',
    flex: '1 1 auto',
    margin: 2,
  },
  datum_bar: {
    display: 'inline-flex',
    position: 'relative',
    padding: 6,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'whitesmoke',
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2',
  },
  datum_bar_input: {
    display: 'inline-flex',
    position: 'relative',
    flex: 'unset',
    paddingLeft: 12,
    paddingTop: 2,
    paddingRight: 12,
    margin: 3,

    border: '1px dashed red',
    borderRadius: 16,
    fontSize: '0.8125rem',
  },
  hidden_span: { // used to calculate datum bar input width
    display: 'inline',
    position: 'absolute',
    padding: '0 13px',
    left: 0,
    bottom: 0,

    fontSize: '0.8125rem',
  },
}


const TagBar = props => {

  const tags_that_match = tag_names
    .filter(t => t.indexOf(props.filter) >= 0)
    .map((t, i) => (
      <Tag
        key={i}
        name={t} 
        variant='outlined'
        onClick={() => props.onClick(t)}
        style={styles.tag_menu_tag}
      />
    ))
  const is_menu_open = props.is_open && tags_that_match.length ?
    'flex' :
    'none'

  return (
    <div style={{
      ...styles.tag_menu,
      display: is_menu_open,
    }}>
      {tags_that_match}
    </div>
  )

}

class DatumBar extends Component {

  constructor(props) {
    super(props)
    this.MIN_INPUT_WIDTH = 32
    this.hidden_span = React.createRef()

    this.state = {
      is_tag_menu_open: false,
      //is_tag_value_menu_open: false,
      //active_tag: null,
      input_width: undefined,
    }

    this.select_tag_menu_tag = this.select_tag_menu_tag.bind(this)
    this.onAddDatum = this.onAddDatum.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.render_chip = this.render_chip.bind(this)
    this.close_tag_menu_on_submit = this.close_tag_menu_on_submit.bind(this)
  }

  componentDidMount() {
    const input_width = Math.max(
      this.hidden_span.current.offsetWidth, 
      this.MIN_INPUT_WIDTH
    )
    this.setState({ input_width })
  }
  componentDidUpdate() {
    const input_width = Math.max(
      this.hidden_span.current.offsetWidth, 
      this.MIN_INPUT_WIDTH
    )
    if (this.state.input_width !== input_width) this.setState({ input_width })
  }
  /*shouldComponentUpdate(nextProps, nextState) {
		if (
      this.props !== nextProps &&
      this.state !== nextState
    ) return true
		return false
  }*/

  select_tag_menu_tag(tag) {
    this.props.onAddTag(tag)
  }

  onAddDatum(e) {
    console.log('add datum!')
    if (e.target.value == '') this.setState({is_tag_menu_open: false})
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
    ) this.setState({is_tag_menu_open: false})
    if (
      e.key !== 'Enter' &&
      this.props.InputProps.value === ''
    ) this.setState({is_tag_menu_open: true})
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
    const is_background_dimmed = this.state.is_tag_menu_open ? 
      'flex' : 'none'

    return (
      <div 
        style={styles.container}
        onFocus={() => this.setState({is_tag_menu_open: true})}
      >

        <span 
          ref={this.hidden_span}
          style={styles.hidden_span} 
        >{this.props.InputProps.value}</span>

        <div 
          onClick={() => this.setState({is_tag_menu_open: false})}
          style={{
            ...styles.dimmed_background, 
            display: is_background_dimmed,
          }} 
        />

        <TagBar
          is_open={this.state.is_tag_menu_open}
          filter={this.props.InputProps.value}
          onClick={this.props.onAddTag}
        />

        <ChipInput
          value={this.props.value}
          onAdd={this.onAdd}
          onDelete={this.props.onDeleteTag}
          chipRenderer={this.render_chip}
          InputProps={{
            ...this.props.InputProps,
            onKeyPress: this.close_tag_menu_on_submit,
            style: {
              ...styles.datum_bar_input,
              width: this.state.input_width,
            }
          }}
          disableUnderline
          fullWidth
          style={styles.datum_bar}
        />

      </div>
    )
  }
}

export default DatumBar