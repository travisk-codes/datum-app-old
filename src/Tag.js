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

function Tag(props) {
  const { classes } = props
  return (
    <div>
      <Chip
        label='tag'
        color='secondary'
        classes={{
         label: classes.tag,
        }}
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      />
      <Chip
        label='value'
        variant='outlined'
        color='secondary'
        classes={{
          label: classes.value,
        }}
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      />
    </div>
  )
}

export default withStyles(styles)(Tag)