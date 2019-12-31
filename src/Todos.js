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

	function onClick(todo_item) {
		console.log(todo_item)
		if (todo_item.hasTag('done')) {
			todo_item.removeTag('done')
		} else {
			todo_item.addTag('done')
		}
		console.log(todo_item)
		props.onToggle(todo_item)
}

	const TodoCheckbox = () => (
		<ListItemIcon>
			<Checkbox
				edge="start"
				checked={props.todo.hasTag('done')}
				tabIndex={-1}
				disableRipple
				inputProps={{ 'aria-labelledby': props.todo.getId()}}
			/>
		</ListItemIcon>
	)

	const TodoName = () => (
		<ListItemText
			id={props.todo.getId()}
			primary={props.todo.getValue('todo')}
		/>
	)

	const TodoMenu = () => (
		<ListItemSecondaryAction>
			<TodoItemMenu
				onSelectDelete={() => props.onSelectDelete(props.id)}
				onSelectEdit={() => props.onSelectEdit(props.id)}
			/>
		</ListItemSecondaryAction>
	)

	return (
		<ListItem 
		button 
		onClick={() => onClick(props.todo)}
	>
			<TodoCheckbox />
			<TodoName />
			<TodoMenu />
		</ListItem>
	)

}

function Todos(props) {



	const list_items = props.todoItems.map(ti => {
		return (
			<TodoItem
				todo={ti}
				onSelectDelete={() => props.onSelectDelete(ti.id)}
				onSelectEdit={() => props.onSelectEdit(ti.id)}
				onToggle={() => props.onToggleTodo(ti)}
			/>
		)
	})

  return (
    <List>
			{list_items}
    </List>
  );
}

export default Todos