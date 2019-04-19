import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
	Button,
	TextField,
} from '@material-ui/core'

import logo from './datum-logo.svg'

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		position: 'fixed',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		backgroundColor: 'red',
		zIndex: 999999999,
	},
	logo: {
		display: 'block',
		position: 'relative',
		marginTop: 60,
		margin: '0 auto',
		height: 60,
	},
	tag_line: {
		marginTop: 10,
		color: 'white',
	}
}

/*
logo
tagline
learn more
signup
login
password
go to app
*/

class Splash extends Component {
	
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.datums !== nextProps.datums) return true
		return false
	}

	render() {
		const classes = { ...this.props.classes }
		return (
			<div className={classes.container}>
				<img
					src={logo}
					alt='logo'
					className={classes.logo}
      	/>
				<span className={classes.tag_line}>
					{'A personal info management platform'}
				</span>
				<Button variant='outlined' size='large'>
					Learn More
				</Button>
				<TextField className={classes.tag_line}
					label='Signup'
				/>
				<TextField
					label='Login'
				/>
				<TextField
					label='Password'
				/>
				<Button 
					onClick={this.props.switch_view_to_app}
					variant='outlined' size='large'>
					Go to App
				</Button>
			</div >
		)
	}
}

export default withStyles(styles)(Splash)