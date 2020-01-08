import React from 'react'
import { 
	AppBar,
	IconButton,
	Toolbar,
} from '@material-ui/core'
import MoreIcon from '@material-ui/icons/MoreVertRounded'
import { withStyles } from '@material-ui/core/styles'

const styles = {
	top_bar: {
		height: 34,
	},
}

const TopBar = () => (
	<AppBar
	color='secondary'
>
	<Toolbar>
		<img 
			style={{paddingTop: 5, marginLeft: '-6px'}}
			src="datum-logo.png" 
			width="140px" 
			alt="Datum logo"
		/>
		<IconButton color='primary'>
			<MoreIcon />
		</IconButton>
	</Toolbar>
</AppBar>
)

export default withStyles(styles)(TopBar)
