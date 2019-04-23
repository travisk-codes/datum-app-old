import React, { Component } from 'react'
import { List, ListItem } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Datum from './Datum'

const styles = {
	datum_list: {
		//marginTop: 60, // TODO: set dynamically to app bar height
		marginBottom: 46, // for datum bar
		overflow: 'hidden', // for scaling datums with open menus
		//position: 'fixed',
		//width: '100%',
		//bottom: 0,
	},
}

const DatumList = (props) => {
	const { classes, ...p } = props
	return (
		<List dense className={classes.datum_list}>
			{p.datums.map(d => (
				<Datum key={d.id} {...d} {...p} />
			))}
		</List>
	)
}

export default withStyles(styles)(DatumList)
