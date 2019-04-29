import React from 'react'
import Chip from '@material-ui/core/Chip'
import { withStyles } from '@material-ui/core/styles'

import { objectify } from './utils/getTagColor'

const base = {
  position: 'relative',
  display: 'inline-flex',
  margin: 3,
  borderWidth: 1,
  borderStyle: 'solid',
  color: 'lightgrey',
}
const styles = {
  whole_name: {
    ...base,
    color: 'white',
  },
  whole_value: {
    ...base,
    backgroundColor: 'white',
  },
  half_name: {
    ...base,
    marginRight: 0,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    color: 'white',
  },
  half_name_label: { paddingRight: 6 },
  half_value: {
    ...base,
    marginLeft: 0,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'white',
  },
  half_value_label: { paddingLeft: 6 },
  name_value_pair: {
    ...base,
    borderWidth: 0,
    maxWidth: '100%',
    margin: 0,
    //wrap: 'nowrap'
  }
}

const WholeName = ({
  label,
  color,
  onClick,
  classes,
}) => {
  return (
    <Chip clickable={true}
      label={label}
      onClick={onClick}
      className={classes.whole_name}
      style={{
        backgroundColor: color,
        borderColor: color,
      }
      }
    />
  )
}

const WholeValue = ({
  label,
  color,
  onClick,
  classes,
}) => (
    <Chip
      clickable={true}
      label={label}
      onClick={onClick}
      className={classes.whole_value}
      style={{
        color,
        borderColor: color,
      }}
    />
  )

const HalfName = ({
  name,
  color,
  onClick,
  classes,
}) => (
    <Chip
      clickable={true}
      label={name}
      onClick={onClick}
      classes={{
        root: classes.half_name,
        label: classes.half_name_label,
      }}
      style={{
        backgroundColor: color,
        borderColor: color,
      }}
    />
  )

const HalfValue = ({
  value,
  color,
  onClick,
  classes,
}) => (
    <Chip
      clickable
      label={value}
      onClick={onClick}
      classes={{
        root: classes.half_value,
        label: classes.half_value_label,
      }}
      style={{ color }}
    />
  )

export const Name = withStyles(styles)(({
  whole,
  half,
  ...props
}) => {
  if (whole) return <WholeName {...props} />
  if (half) return <HalfName {...props} />
  console.error('Name requires whole or half prop')
  return null
})

export const Value = withStyles(styles)(({
  whole,
  half,
  ...props
}) => {
  if (whole) return <WholeValue {...props} />
  if (half) return <HalfValue {...props} />
  console.error('Value requires whole or half prop')
  return null
})

const NameValuePair = ({ classes, ...props }) => {
  return (
    <div className={classes.name_value_pair}>
      <Name {...props} half />
      <Value {...props} half />
    </div>
  )
}

const Tag = (props) => {
  let name, value
  if (props.label) { // label='name:value'
    ({ name, value } = objectify(props.label))
  } else { // name='name' and/or value='value'
    ({ name, value } = props)
  }

  if ( // TODO.
    value == 'null' ||
    value == 'undefined' ||
    value == undefined
  ) value = null

  if (name && value) {
    return <NameValuePair
      {...props}
      name={name}
      value={value}
    />
  } else if (name) {
    return <Name whole
      {...props}
      label={name}
      color={props.color}
    />
  } else if (value) {
    return <Value whole label={value} {...props} />
  } else {
    console.error('Tag requires label, name, or value prop')
    return null
  }
}

export default withStyles(styles)(Tag)
