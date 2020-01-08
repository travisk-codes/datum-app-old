import React from 'react'
import { 
	AppBar,
	IconButton,
	Toolbar,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/MenuRounded'
import { withStyles } from '@material-ui/core/styles'

const styles = {
	top_bar: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingRight: 6,
	},
}

const TopBar = (props) => {
	const { classes } = props

	return (
		<AppBar
			color='secondary'
		>
			<Toolbar className={classes.top_bar}>
				<img 
					style={{paddingTop: 5, marginLeft: '-6px'}}
					src="datum-logo.png" 
					width="140px" 
					alt="Datum logo"
				/>
				<IconButton onClick={props.onOpenSettingsMenu} color='primary'>
					<MenuIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}

export default withStyles(styles)(TopBar)
