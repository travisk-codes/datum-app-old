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
	container_item: {
		margin: 5,
	},
	logo: {
		display: 'block',
		position: 'relative',
		marginTop: 60,
		margin: '0 auto',
		height: 60,
	},
	tag_line: {
		margin: 10,
		color: 'white',
		marginBottom: 40,
		cursor: 'unset',
	},
	input: {
		color: 'white',
		underline: 'white',
		marginBottom: 5,
	},
	input_underline: {
		'&:after': {
			borderBottom: `2px solid rgba(255,255,255,.7)`
		},
		'&:before': {
			borderBottom: '1px solid white'
		},
		'&:hover:not($disabled):before': {
			borderBottom: `2px solid white`,
			'@media (hover: none)': {
				borderBottom: `1px solid white`,
			},
		},
	},
	underline: {
		'&:after': {
			borderBottom: `2px solid rgba(255,255,255,.7)`,
			left: 0,
			bottom: 0,
			// Doing the other way around crash on IE 11 "''" https://github.com/cssinjs/jss/issues/242
			content: '""',
			position: 'absolute',
			right: 0,
			transform: 'scaleX(0)',
			/*transition: theme.transitions.create('transform', {
				duration: theme.transitions.duration.shorter,
				easing: theme.transitions.easing.easeOut,
			}),*/
			pointerEvents: 'none', // Transparent to the hover style.
		},
		'&$focused:after': {
			transform: 'scaleX(1)',
		},
		'&$error:after': {
			//borderBottomColor: theme.palette.error.main,
			transform: 'scaleX(1)', // error is always underlined in red
		},
		'&:before': {
			borderBottom: `1px solid rgba(255,255,255,.7)`,
			left: 0,
			bottom: 0,
			// Doing the other way around crash on IE 11 "''" https://github.com/cssinjs/jss/issues/242
			content: '"\\00a0"',
			position: 'absolute',
			right: 0,
			/*transition: theme.transitions.create('border-bottom-color', {
				duration: theme.transitions.duration.shorter,
			}),*/
			pointerEvents: 'none', // Transparent to the hover style.
		},
		'&:hover:not($disabled):before': {
			borderBottom: `2px solid white`,
			// Reset on touch devices, it doesn't add specificity
			'@media (hover: none)': {
				borderBottom: `1px solid rgba(255,255,255,.7)`,
			},
		},
		'&$disabled:before': {
			borderBottomStyle: 'dotted',
		},
	},
	button: {
		color: 'white',
		borderColor: 'rgba(255,255,255,.5)',
	},
	button_container: {
		marginTop: 30,
		display: 'inline',
	},
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
	state = {
		sign_up_input: '',
		login_input: '',
		password_input: '',
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.datums !== nextProps.datums) return true
		if (this.state !== nextState) return true
		return false
	}

	render_text_field(props) {
		const { classes } = this.props
		return (
			<TextField
				InputProps={{
					disableUnderline: false,
					classes: {
						underline: classes.underline,
					}
				}}
				InputLabelProps={{style: { color: 'white'}}}
				inputProps={{style: { color: 'white'}}}
				label={props.label}
				key={props.label}
				value={props.value}
				onChange={props.onChange}
				className={`${classes.container_item} ${classes.input}`}
			/>
		)
	}

	render() {
		const classes = { ...this.props.classes }
		const text_fields = [
			{
				label: 'Sign Up',
				value: this.state.sign_up_input,
				onChange: (e) => this.setState({sign_up_input: e.target.value})
			},
			{
				label: 'Login',
				value: this.state.login_input,
				onChange: (e) => this.setState({login_input: e.target.value})
			},
			{
				label: 'Password',
				value: this.state.password_input,
				onChange: (e) => this.setState({password_input: e.target.value})
			},
		]
		return (
			<div className={classes.container}>
				<img
					src={logo}
					alt='logo'
					className={classes.logo}
      	/>
				<span className={classes.tag_line}>
					{'a personal info management platform'}
				</span>

				{text_fields.map(tf => this.render_text_field(tf))}

				<div className={classes.button_container}>
					<Button component='span' variant='outlined' size='medium' className={`${classes.button} ${classes.container_item}`}>
						Learn More
					</Button>
					<Button 
						onClick={this.props.switch_view_to_app}
						variant='outlined' size='medium'
						component='span'
						className={`${classes.button} ${classes.container_item}`}
					>
						Go to App
					</Button>
				</div>
			</div >
		)
	}
}

export default withStyles(styles)(Splash)