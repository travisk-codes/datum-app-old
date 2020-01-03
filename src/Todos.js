import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Divider,
	Fab,
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
import MenuIcon from '@material-ui/icons/MenuRounded'
import AddIcon from '@material-ui/icons/AddRounded'

const useStyles = makeStyles(theme  => ({
	checkbox: {
		paddingLeft: 10,
	},
	fab: {
		position: 'fixed',
		right: 5,
		bottom: 5,
	},
}))

function TodoItemMenu(props) {

	const [anchor_el, setAnchorEl] = React.useState(null)

	function onClick(e) {
		e.stopPropagation()
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
	const classes = useStyles()

	function onClick(todo_item) {
		if (todo_item.hasTag('done')) {
			todo_item.removeTag('done')
		} else {
			todo_item.addTag('done')
		}
		props.onToggle(todo_item)
}

	const TodoCheckbox = () => (
		<ListItemIcon className={classes.checkbox}>
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
				button
				onClick={() => onClick(props.todo)}
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
	const classes = useStyles()
	let [ text, setText ] = React.useState('')

	let incomplete_todos = [], complete_todos = []

	function on_click_btn(e) {
		e.preventDefault()
		if (!text.length) {
			props.onButtonLongPress(e)
		} else {
			props.onAddTodo(e)
		}
	}

	const list_items = props.todoItems.map(ti => {
		if (ti.hasTag('done')) {
			complete_todos.push((
				<TodoItem
					todo={ti}
					done
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

	const btn_icon =
	!text.length ? <MenuIcon /> : <AddIcon />

  return (
		<>
			<List>
				{incomplete_todos}
				{complete_todos}
			</List>
			<Fab
				onClick={on_click_btn}
				onContextMenu={props.onButtonLongPress} // capture long press & right click
				onDoubleClick={props.onButtonLongPress}
				className={classes.fab}
				color='primary'
				size='small'
			>
				{btn_icon}
			</Fab>
		</>
  );
}

export default Todos