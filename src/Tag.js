import React from 'react';
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
    <div style={{
      ...props.style,
      display: 'inline-block',
    }}>
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
        }}
      /> : null }
    </div>
  )
}

export default withStyles(styles)(Tag)