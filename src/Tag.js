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

const Tag = (props) => {
  const { classes } = props
  
  return (
    <Fragment>
      <Chip
        label={props.name}
        color='primary'
        classes={{
         label: classes.tag,
        }}
        style={{
          borderTopRightRadius: props.value ? 0 : 16,
          borderBottomRightRadius: props.value ? 0: 16,
          paddingRight: props.value ? 0 : 6,
          marginTop: props.isActiveDatumTag ? -24 : 0,
        }}
      />
      { props.value ? <Chip
        label={props.value}
        variant='outlined'
        color='primary'
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