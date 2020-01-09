import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import MoreIcon from '@material-ui/icons/MoreVert'
import {
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Menu,
	MenuItem,
	IconButton,
} from '@material-ui/core'

import Tag from './Tag'
import timestamp from '../utils/timestamp'

const styles = {
	container: {
		'& span': {
			display: 'inline-flex',
			overflow: 'auto',
<<<<<<< HEAD
<<<<<<< HEAD
			width: '100%',
		}
	},
	datum: {
		paddingLeft: 4
=======
		},
		overflow: 'scroll',
>>>>>>> 880d239... fixes datum layout
=======
			width: '100%',
		},
>>>>>>> f9c220f... minor tweaks, clean up, etc.
	},
	datum_w_menu_open: {
		boxShadow: '0 0 13px -10px black',
		backgroundColor: 'white',
	},
	timestamp: {
		fontSize: 11, 
		color: 'grey',
		whiteSpace: 'nowrap',
		margin: 3,
		paddingTop: 9,
<<<<<<< HEAD
		width: 36,
		textAlign: 'center',
	},
	rightScrollFade: {
		background: 'linear-gradient(to left, #fafafa, #ffffff00)',
=======
		textAlign: 'center',
		paddingRight: 9,
		justifyContent: 'flex-end',
	},
	rightScrollFade: {
		background: 'linear-gradient(to left, #fafafa, #ffffff00',
>>>>>>> 880d239... fixes datum layout
		width: 40,
		height: '100%',
		right: '48px',
		top: 0,
		bottom: 0,
<<<<<<< HEAD
		position: 'absolute'
=======
		position: 'absolute',
>>>>>>> 880d239... fixes datum layout
	}
}

const Timestamp = props => (
	<div className={props.className}>
		{timestamp(props.time)}
	</div>
)

class DatumMenu extends Component {
	state = {
		anchorEl: null,
	}

	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget })
		this.props.on_menu_open(event)
	}

	handleClose = () => {
		this.setState({ anchorEl: null })
		this.props.on_menu_close()
	}

	handleDelete = () => {
		this.props.onSelectDelete()
		this.handleClose()
	}

	handleEdit = () => {
		this.props.onSelectEdit()
		this.handleClose()
	}

	render() {
		const { anchorEl } = this.state

		return (
			<div>
				<IconButton
					aria-owns={anchorEl ? 'list-datum-menu' : undefined}
					aria-haspopup="true"
					size='small'
					onClick={this.handleClick}
				>
					<MoreIcon />
				</IconButton>
				<Menu
					id="list-datum-menu"
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={this.handleClose}
				>
					<MenuItem onClick={this.handleEdit}>Edit</MenuItem>
					<MenuItem onClick={this.handleDelete}>Delete</MenuItem>
				</Menu>
			</div>
		);
	}
}

class Datum extends Component {
	state = {
		menu_open: false,
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props !== nextProps) return true
		if (this.state !== nextState) return true
		return false
	}

	render() {
		const { classes } = this.props
		return (
			<ListItem divider className={(this.state.menu_open ? classes.datum_w_menu_open : classes.datum)}>
				<ListItemText className={classes.container}>
<<<<<<< HEAD
<<<<<<< HEAD
				<Timestamp time={this.props.time} className={classes.timestamp}/>

=======
					<Timestamp time={this.props.time} className={classes.timestamp}/>
>>>>>>> 880d239... fixes datum layout
=======
>>>>>>> f9c220f... minor tweaks, clean up, etc.
					{this.props.tags.map(t => (
						<Tag
							key={t.name + t.value}
							label={t.name + ':' + t.value}
							color={this.props.tag_colors[t.name]}
						/>
					))}
					<Timestamp time={this.props.time} className={classes.timestamp}/>	
					<div className={classes.rightScrollFade} />
				</ListItemText>
				<ListItemSecondaryAction>
					<DatumMenu
						on_menu_open={() => this.setState({menu_open: true})}
						on_menu_close={() => this.setState({menu_open: false})}
						onSelectDelete={() => this.props.onSelectDelete(this.props.id)}
						onSelectEdit={() => this.props.onSelectEdit(this.props.id)}
					/>
				</ListItemSecondaryAction>
			</ListItem>
		)
	}
}

export default withStyles(styles)(Datum)