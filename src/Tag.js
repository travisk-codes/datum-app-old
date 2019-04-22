import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import { colors, /*color_numbers*/ } from './utils/getTagColor'

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
		overflowX: 'scroll',
  },
  tag_w_val_chip: {
    color: 'white', 
  },
  tag_w_val_div: {
		margin: 3, 
		whiteSpace: 'nowrap', 
		//textOverflow: 'ellipsis', 
		//overflow: 'hidden',
		maxWidth: '100%', 
		display: 'inline-flex',
	},
	tag_w_val_2nd_chip: {
		//whiteSpace: 'nowrap', 
		//textOverflow: 'ellipsis',
		overflow: 'hidden',
    border: `1px solid`
	},
}

function splitNameValueString(string) {
  const split = string.indexOf(':')
  if (split < 0) return { tag_name: string, tag_value: '' }
  const tag_name = string.substring(0, split)
  const tag_value = string.substring(split + 1)
  return { tag_name, tag_value }
}

const rand_color = ()  => colors[Math.floor(Math.random()*colors.length)]

const TagNoValue = (props) => {
  const color = rand_color()[500]
  return (
    <Chip
      label={props.tag_name}
      classes={props.classes} // TODO: root: props.style ?
      clickable
      onClick={props.onClick}
      variant={props.variant}
      style={{
        ...props.style, 
        color: props.variant === 'outlined' ? 
          color : 'white',
        border: `1px solid ${color}`,
        textShadow: props.variant === 'outlined' ? 
          '0px 0px 20px' : 'none',
        backgroundColor: props.variant === 'outlined' ?
          'white' : color,
        margin: 3,
      }}
    />
  )
}

const TagWithValue = (props) => {
  const color = rand_color()[500]
  return (
    <div style={{...props.style, ...styles.tag_w_val_div}}>
      <Chip
        label={props.tag_name}
        classes={props.name_classes}
        clickable
        onClick={props.onClick}
        style={{
					...props.style, 
					...styles.tag_w_val_chip,
					backgroundColor: color,
				}}
        />
      <Chip
        label={props.tag_value}
        variant='outlined'
        classes={props.value_classes}
				style={{
					...props.style,
					...styles.tag_w_val_2nd_chip,
          borderColor: color,
          color,
				}}
        />
    </div>
  )
}

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
      color={props.color}
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
      color={props.color}
      classes={{
        label: props.classes.tag_no_value,
        root: props.classes.tag_no_value,
      }}
      variant={props.variant}
      onClick={props.onClick}
      style={props.style}
    />
  )
  return renderTag(tag_name, tag_value)
}

export default withStyles(styles)(Tag)
