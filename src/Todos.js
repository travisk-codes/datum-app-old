import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	Menu,
	MenuItem,
	Checkbox,
	IconButton,
} from '@material-ui/core'
import CommentIcon from '@material-ui/icons/Comment';
import MoreIcon from '@material-ui/icons/MoreVert'

function TodoItemMenu(props) {
	const [anchor_el, setAnchorEl] = React.useState(null)

	function onClick(e) {
		setAnchorEl(e.currentTarget)
	}
	function onClose() {
		setAnchorEl(null)
	}
	function onDelete() {
		props.onSelectDelete()
		onClose()
	}
	function onEdit() {
		props.onSelectEdit()
		onClose()
	}

	return (
		<div>
		<IconButton
			aria-owns={anchor_el ? 'todo-item-menu' : undefined}
			aria-haspopup="true"
			size='small'
			onClick={onClick}
		>
			<MoreIcon />
		</IconButton>
		<Menu
			id="todo-item-menu"
			anchorEl={anchor_el}
			open={Boolean(anchor_el)}
			onClose={onClose}
		>
			<MenuItem onClick={onEdit}>Edit</MenuItem>
			<MenuItem onClick={onDelete}>Delete</MenuItem>
		</Menu>
	</div>
)
}

function TodoItem(props) {
	const checkbox = (
		<ListItemIcon>
			<Checkbox
				edge="start"
				checked={props.isDone}
				tabIndex={-1}
				disableRipple
				inputProps={{ 'aria-labelledby': props.id }}
			/>
		</ListItemIcon>
	)
	const name = (
		<ListItemText
			id={props.id}
			primary={props.text}
		/>
	)
	const menu = (
		<ListItemSecondaryAction>
			<TodoItemMenu
				onSelectDelete={() => props.onSelectDelete(props.id)}
				onSelectEdit={() => props.onSelectEdit(props.id)}
			/>
		</ListItemSecondaryAction>
	)
	return (
		<ListItem>
			{checkbox}
			{name}
			{menu}
		</ListItem>
	)
}

function Todos(props) {

  return (
    <List>
			{props.todoItems.map(ti => {
				let text = ''
				ti.tags.forEach(t => {
					if (t.name === 'todo') text = t.value
				})
				return (
				<TodoItem
					id={ti.id}
					text={text}
					isDone={Object.keys(ti.tags).includes('done')}
					onSelectDelete={() => props.onSelectDelete(ti.id)}
					onSelectEdit={() => props.onSelectEdit(ti.id)}
				/>
				)})}
    </List>
  );
}

export default Todos