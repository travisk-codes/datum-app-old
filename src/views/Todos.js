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
	TextField,
	Typography,
} from '@material-ui/core'
import MoreIcon from '@material-ui/icons/MoreVert'
import MenuIcon from '@material-ui/icons/AmpStoriesRounded'
import AddIcon from '@material-ui/icons/AddRounded'

const useStyles = makeStyles(theme  => ({
	container: {
		marginTop: 60, // top bar with extra space
		marginBottom: 56, // bottom bar
		position: 'fixed',
		width: '100%',
	},
	checkbox: {
		paddingLeft: 10,
	},
	todoBar: {
		display: 'inline-flex',
		position: 'fixed',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch',
		left: 0,
		right: 0,
		bottom: 0,
		height: 56,
		boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2)',
		paddingLeft: 6,
		paddingRight: 56,
		backgroundColor: 'whitesmoke',
	},
	fab: {
		position: 'fixed',
		right: 8,
		bottom: 8,
	},
	todoTextField: {
		display: 'flex',
		alignItems: 'stretch',
	},
	title: {
		paddingLeft: '.95em',
		fontWeight: 'bold',
		backgroundColor: 'whitesmoke'
	},
	sectionDivider: {
		//	width: '5em',
		}
}))

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

	const [anchor_el, setAnchorEl] = React.useState(null)

	function onClickMenu(e) {
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
				<ListItemSecondaryAction>
					<IconButton
					aria-owns={anchor_el ? 'todo-item-menu' : undefined}
					edge='end'
					aria-haspopup="true"
					onClick={onClickMenu}
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
				</ListItemSecondaryAction>
			</ListItem>
			<Divider variant='inset' component='hr' />
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
			props.onAddTodo([{
				name: 'todo',
				value: text,
			}])
			setText('')
		}
	}

	function onChangeTodoTextField(e) {
		setText(e.target.value)
	}

	function onSubmitTodo(e) {
		e.preventDefault()
		props.onAddTodo([{
			name: 'todo',
			value: text,
		}])
		setText('')
	}

	props.todoItems.forEach(ti => {
		if (ti.hasTag('done')) {
			complete_todos.push((
				<TodoItem
					key={ti.getId()}
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
					key={ti.getId()}
					todo={ti}
					onSelectDelete={() => props.onSelectDelete(ti.id)}
					onSelectEdit={() => props.onSelectEdit(ti.id)}
					onToggle={() => props.onToggleTodo(ti)}
				/>
			))
		}
	})

	const btn_icon = !text.length ? <MenuIcon /> : <AddIcon />

  return (
		<div className={classes.container}>
			<List>
				<Typography className={classes.title} variant='subtitle1'>Todo</Typography>
				<Divider className={classes.sectionDivider} />
				{incomplete_todos}
				<Divider style={{width: '5.135em', marginTop: -1}} />
				<Typography className={classes.title} variant='subtitle1'>Done</Typography>
				<Divider className={classes.sectionDivider} />
				{complete_todos}
			</List>
			<div className={classes.todoBar}>
				<form onSubmit={e => onSubmitTodo(e)}>
					<TextField 
						className={classes.todoTextField} 
						onChange={e => onChangeTodoTextField(e)}
						value={text}
						label='Todo' 
						placeholder='New Todo' 
						variant='outlined' 
						size='small' 
						color='secondary'
					/>
				</form>
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
			</div>
		</div>
  );
}

export default Todos