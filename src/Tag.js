import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const styles = {
  tag_no_value: {
    paddingRight: 6,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  tag_with_value: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  value: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  name_label: {
    paddingRight: 6,
  },
  value_label: {
    paddingLeft: 6,
  },
}

function splitNameValueString(string) {
  const split = string.indexOf(':')
  if (split < 0) return { tag_name: string, tag_value: null }
  const tag_name = string.substring(0, split)
  const tag_value = string.substring(split + 1)
  return { tag_name, tag_value }
}

const TagNoValue = (props) => (
  <Chip
    label={props.tag_name}
    color={ props.color || 'primary' }
    classes={props.classes} // TODO: root: props.style ?
    clickable
    onClick={props.onClick}
    style={props.style}
    variant={props.variant}
  />
)

const TagWithValue = (props) => (
  <div style={{...props.style, display: 'inline-flex'}}>
    <Chip
      label={props.tag_name}
      color={ props.color || 'primary' }
      classes={props.name_classes}
      clickable
      onClick={props.onClick}
      //style={props.name_style}
    />
    <Chip
      label={props.tag_value}
      variant='outlined'
      color={ props.color || 'primary' }
      classes={props.value_classes}
      //style={props.value_style}
    />
  </div>
)

const Tag = (props) => {
  let tag_name, tag_value
  if (props.nameValueString) {
    let results = splitNameValueString(props.nameValueString)
    tag_name = results.tag_name
    tag_value = results.tag_value === 'null' ? null : results.tag_value
  } else {
    tag_name = props.name
    tag_value = props.value
  }
  const renderTag = (name, value = null) => (
    value ?
    <TagWithValue
      tag_name={name}
      tag_value={value}
      name_classes={{
        label: props.classes.name_label,
        root: props.classes.tag_with_value,
      }}
      value_classes={{
        label: props.classes.value_label,
        root: props.classes.value,
      }}
      onClick={props.onClick}
      //name_style={props.style}
      value_style={props.style}
    /> :
    <TagNoValue
      tag_name={name}
      classes={{
        label: props.classes.tag_no_value,
        root: props.classes.tag_no_value,
      }}
      onClick={props.onClick}
      style={props.style}
    />
  )
  return renderTag(tag_name, tag_value)
}

export default withStyles(styles)(Tag)
