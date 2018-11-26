import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const styles = {
  tag: {
    paddingRight: 6,
  },
  value: {
    paddingLeft: 6,
  }
}

function splitNameValueString(string) {
  let tagName, tagValue
  const split = string.indexOf(':')
  if (split >= 0) { // i.e. there's a colon
    tagName = string.substring(0, split)
    tagValue = string.substring(split + 1)
  } else {
    tagName = string
    tagValue = null
  }
  return { tagName, tagValue }
}

const Tag = (props) => {
  const { classes } = props
  let tagName, tagValue
  if (props.nameValueString) {
    let results = splitNameValueString(props.nameValueString)
    tagName = results.tagName
    tagValue = results.tagValue === 'null' ? null : results.tagValue
  } else {
    tagName = props.name
    tagValue = props.value
  }
  return (
    <Fragment>
      <Chip
        label={tagName}
        color={ props.color || 'primary' }
        classes={{
         label: classes.tag,
        }}
        onClick={props.onClick}
        style={{
          borderTopRightRadius: tagValue ? 0 : 16,
          borderBottomRightRadius: tagValue ? 0: 16,
          paddingRight: tagValue ? 0 : 6,
          marginTop: props.isActiveDatumTag ? -24 : 0,
        }}
      />
      { tagValue ? <Chip
        label={tagValue}
        variant='outlined'
        color={ props.color || 'primary' }
        classes={{
          label: classes.value,
        }}
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          marginTop: props.isActiveDatumTag ? -24 : 0,
        }}
      /> : null }
    </Fragment>
  )
}

export default withStyles(styles)(Tag)