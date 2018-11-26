import React, { Component, Fragment } from 'react'
import {
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	Menu,
	MenuItem,
	IconButton,
} from '@material-ui/core'
import MoreIcon from '@material-ui/icons/MoreVert'

import Tag from './Tag'
import initDatums from './datums'

class DatumMenu extends Component {
	state = {
		anchorEl: null,
	}

	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget })
	}

	handleClose = () => {
		this.setState({ anchorEl: null })
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

class DatumList extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.datums !== nextProps.datums) return true
		return false
	}

	render() {
		const TagSpacer = () => (<div style={{ display: 'inline-block', width: 6 }} />)
		const datums = this.props.datums.map(datum => (
			<ListItem divider key={datum.id}>
				<ListItemText>
					{datum.tags.map((tag, index) => (
						<Fragment key={index}>
							<Tag
								name={tag.name}
								value={tag.value}
							/>
							<TagSpacer />
						</Fragment>
					))}
				</ListItemText>
				<ListItemSecondaryAction>
					<DatumMenu
						onSelectDelete={() => this.deleteDatum(datum.id)}
						onSelectEdit={() => this.editDatum(datum.id)}
					/>
				</ListItemSecondaryAction>
			</ListItem>
		))
		return (
			<List style = {{
				marginTop: 64, // TODO: set dynamically to app bar height
				marginBottom: 43, // for datum bar
			}}>{datums}</List >
		)
	}
}

export default DatumList