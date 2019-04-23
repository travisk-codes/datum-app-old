import React from 'react'
import { AppBar, Toolbar } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = {
	top_bar: {
		height: 34,
	},
}

const TopBar = () => (
	<AppBar position='fixed'>
		<Toolbar>
			<img
				src={logo}
				alt='logo'
				className={classes.top_bar}			/>
		</Toolbar>
	</AppBar>
)

export default withStyles(styles)(TopBar)
