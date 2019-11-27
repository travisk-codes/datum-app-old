import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Button, TextField } from '@material-ui/core'

import { signIn } from './utils/auth'
import {db} from './utils/db'
import { datum_schema, tag_schema } from './schemas'
//import secret from './secret'
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
		backgroundColor: '#ff2626',
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
		marginBottom: 15,
		color: 'white',
		cursor: 'unset',
	},
	input: {
		color: 'white',
		underline: 'white',
		marginBottom: 5,
	},
	input_underline: {
		'&:after': {
			borderBottom: `2px solid rgba(255,255,255,.7)`,
		},
		'&:before': {
			borderBottom: '1px solid white',
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
	inline_container: {
		margin: '0 auto',
		marginTop: '1.5em',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		width: '12em',
	},
}

class Splash extends Component {
	constructor(props) {
		super(props)
		this.state = {
			sign_up_input: '',
			login_input: '',
			password_input: '',
			verify_input: '',
		}
		this.handle_submit = this.handle_submit.bind(this)
		this.signIn = this.signIn.bind(this)
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.datums !== nextProps.datums) return true
		if (this.state !== nextState) return true
		return false
	}

	render_submit_button() {
		const s = this.state
		const { classes } = this.props
		if (
			(s.login_input && s.password_input) ||
			(s.sign_up_input &&
				s.password_input &&
				s.verify_input)
		) {
			return (
				<Button
					variant='outlined'
					size='large'
					type='submit'
					onClick={() => console.log('submit')}
					className={`${classes.button} ${classes.container_item}`}
					style={{ marginTop: 10, width: 218 }}
				>
					Submit
				</Button>
			)
		}
	}

	render_text_field(props) {
		const { classes } = this.props
		return (
			<TextField
				InputProps={{
					disableUnderline: false,
					classes: {
						underline: classes.input_underline,
					},
				}}
				//eslint-disable-next-line
				inputProps={{ style: { color: 'white' } }}
				InputLabelProps={{ style: { color: 'white' } }}
				style={{
					...props.style,
					display: props.show ? 'inline-flex' : 'none',
				}}
				label={props.label}
				key={props.label}
				value={props.value}
				onChange={props.onChange}
				className={`${classes.container_item} ${classes.input}`}
			/>
		)
	}

	async handle_submit(e) {
		e.preventDefault()
		const s = this.state
		let username, password, is_signing_up
		if (s.login_input && s.password_input) {
			is_signing_up = false
		} else if (
			s.sign_up_input &&
			s.password_input &&
			s.password_input === s.verify_input
		) {
			is_signing_up = true
		} else {
			console.error('login/signup error')
		}
		username = s.sign_up_input || s.login_input
		password = s.password_input
		console.log(is_signing_up)
		this.props.on_login(username, password, is_signing_up)
		this.props.switch_view_to('datum_list')
	}

	async signIn() {
		try {
			await this.props.signIn()
			await this.props.load_db()
		} catch(e) {
			console.error(e)
		}
		this.props.switch_view_to('datum_list')
	}

	render() {
		const classes = { ...this.props.classes }
		const text_fields = [
			{
				label: 'Sign Up',
				value: this.state.sign_up_input,
				onChange: e =>
					this.setState({ sign_up_input: e.target.value }),
				show: Boolean(!this.state.login_input),
				style: {
					width: this.state.sign_up_input ? 'auto' : 104,
				},
			},
			{
				label: 'Login',
				value: this.state.login_input,
				onChange: e =>
					this.setState({ login_input: e.target.value }),
				show: Boolean(!this.state.sign_up_input),
				style: {
					width: this.state.login_input ? 'auto' : 104,
				},
			},
			{
				label: 'Password',
				value: this.state.password_input,
				onChange: e =>
					this.setState({ password_input: e.target.value }),
				show: Boolean(
					this.state.sign_up_input || this.state.login_input
				),
			},
			{
				label: 'Verify Password',
				value: this.state.verify_input,
				onChange: e =>
					this.setState({ verify_input: e.target.value }),
				show: Boolean(
					this.state.password_input &&
						this.state.sign_up_input
				),
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
					{'a personal data management platform\ntesting'}
				</span>

				<div className={classes.inline_container}>
					<Button
						onClick={this.signIn}
						variant='outlined'
						size='medium'
						component='div'
						className={`${classes.button} ${classes.container_item}`}
					>
						Online Sync
					</Button>
					<Button
						onClick={() =>
							this.props.switch_view_to('datum_list')
						}
						component='div'
						variant='outlined'
						size='medium'
						className={`${classes.button} ${classes.container_item}`}
					>
						Offline Only
					</Button>
					<Button
						component='div'
						variant='outlined'
						size='medium'
						className={`${classes.button} ${classes.container_item}`}
					>
						Learn More
					</Button>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(Splash)
