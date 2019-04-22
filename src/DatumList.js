import React, { Component } from 'react'
import { List } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Datum from './Datum'

const styles = {
	datum_list: {
		//marginTop: 60, // TODO: set dynamically to app bar height
		marginBottom: 43, // for datum bar
		overflow: 'hidden', // for scaling datums with open menus
	},
}

class DatumList extends Component {
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.datums !== nextProps.datums) return true
		if (this.state !== nextState) return true
		return false
	}

	render() {
		const { classes, ...p } = this.props
		return (
			<List dense className={classes.datum_list}>
				{p.datums.map(d => (
					<Datum key={d.id} {...d} />
				))}
			</List>
		)
	}
}

export default withStyles(styles)(DatumList)
