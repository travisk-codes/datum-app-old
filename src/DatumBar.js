import React, { Component } from 'react'
import ChipInput from 'material-ui-chip-input'
//import { withStyles } from '@material-ui/core/styles'

import Tag from './Tag'

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
  const tags_that_match = props.tag_names
    .filter(t => t.indexOf(props.filter) >= 0)
    .map((t, i) => (
      <Tag
        key={i}
        name={t}
        onClick={() => props.onClick(t)}
        style={styles.tag_menu_tag}
        color={props.tag_colors[t]}
      />
    ))
  const is_menu_open = props.is_open && tags_that_match.length ?
    'flex' : 'none'

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
      //is_tag_value_menu_open: false,
      //active_tag: null,
      input_width: undefined,
    }

    this.close_tag_menu_on_submit =
      this.close_tag_menu_on_submit.bind(this)
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

  close_tag_menu_on_submit(e) {
    if (
      e.key === 'Enter' &&
      this.props.InputProps.value === ''
    ) this.setState({ is_tag_menu_open: false })
    if (
      e.key !== 'Enter' &&
      this.props.InputProps.value === ''
    ) this.setState({ is_tag_menu_open: true })
  }

  render() {
    const render_chip = ({ isFocused, handleClick, value }, key) => {
      const name = value.slice(0, value.indexOf(':'))
      return (
        <Tag
          onClick={handleClick}
          nameValueString={value}
          isActiveDatumTag
          key={key}
          color={this.props.tag_colors[name]}
          style={{ display: 'inline-flex', margin: 3 }}
        />
      )
    }

    const is_background_dimmed = this.props.is_tag_menu_open ?
      'flex' : 'none'

    return (
      <div
        style={styles.container}
        onFocus={this.props.on_focus}
      >

        <span
          ref={this.hidden_span}
          style={styles.hidden_span}
        >{this.props.InputProps.value}</span>

        <div
          onClick={this.props.on_blur}
          style={{
            ...styles.dimmed_background,
            display: is_background_dimmed,
          }}
        />

        <TagBar
          is_open={this.props.is_tag_menu_open}
          filter={this.props.InputProps.value}
          onClick={this.props.onAddTag}
          tag_colors={this.props.tag_colors}
          tag_names={Object.keys(this.props.tag_colors)}
        />

        <ChipInput
          value={this.props.value}
          onAdd={this.props.onAddTag}
          onDelete={this.props.onDeleteTag}
          chipRenderer={render_chip}
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