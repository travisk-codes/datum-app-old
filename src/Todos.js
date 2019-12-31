import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	Menu,
	MenuItem,
	Checkbox,
	IconButton,
	Typography,
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
		<>
			<IconButton
				aria-owns={anchor_el ? 'todo-item-menu' : undefined}
				edge='end'
				aria-haspopup="true"
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

		</>
	)

}

function TodoItem(props) {

	function onClick(todo_item) {
		if (todo_item.hasTag('done')) {
			todo_item.removeTag('done')
		} else {
			todo_item.addTag('done')
		}
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
				onClick={() => onClick(props.todo)}
			/>
		</ListItemIcon>
	)

	const TodoName = () => (
		<ListItemText
			id={props.todo.getId()}
			style={ props.done ? {
				color: 'grey',
				textDecorationLine: 'line-through'
			} : null}
			primary={
				<Typography
					variant='body1'
				>
					{props.todo.getValue('todo')}
				</Typography>
			}
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
		<div>
			<ListItem
				role={undefined}
				dense
			>
				<TodoCheckbox />
				<TodoName />
				<TodoMenu />
			</ListItem>
			<Divider variant='inset' component='li' />
		</div>
	)

}

function Todos(props) {

	let incomplete_todos = [], complete_todos = []

	const list_items = props.todoItems.map(ti => {
		if (ti.hasTag('done')) {
			complete_todos.push((
				<TodoItem
					todo={ti}
					done={true}
					onSelectDelete={() => props.onSelectDelete(ti.id)}
					onSelectEdit={() => props.onSelectEdit(ti.id)}
					onToggle={() => props.onToggleTodo(ti)}
				/>
			))
		} else {
			incomplete_todos.push((
				<TodoItem
					todo={ti}
					onSelectDelete={() => props.onSelectDelete(ti.id)}
					onSelectEdit={() => props.onSelectEdit(ti.id)}
					onToggle={() => props.onToggleTodo(ti)}
				/>
			))
		}
	})

  return (
    <List>
			{incomplete_todos}
			{complete_todos}
    </List>
  );
}

export default Todos