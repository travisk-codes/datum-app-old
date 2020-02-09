import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

import MenuIcon from '@material-ui/icons/AmpStoriesRounded'
import LinkIcon from '@material-ui/icons/LinkRounded'
import GradeIcon from '@material-ui/icons/GradeRounded'
import Fab from '@material-ui/core/Fab'
import moment from 'moment'
import Datum from '../DatumClass'
import uuid from 'uuid';

const useStyles = makeStyles({
	container: {
		display: 'flex'
	},
	nameCountTableContainer: {
		maxWidth: 'fit-content',
	},
	tableContainer: {
	},
  table: {
		//minWidth: 650,
		marginTop: 60,
	},
	name: {
		padding: '1.95em',
		paddingLeft: '1em',
		paddingRight: '0em',
	},
	header_cell: {
		paddingLeft: 0,
		paddingRight: 0,
	},
	icon_cell: {
		paddingLeft: '0.5em',
		paddingRight: '0.5em',
	},
	checkbox_cell: {
		paddingLeft: 0,
		paddingRight: 0,
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
	},
	todoTextField: {
		display: 'flex',
		alignItems: 'stretch',
	},
	fab: {
		position: 'fixed',
		right: 8,
		bottom: 8,
	}
});

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
let today = moment().day()
const last_seven_days = [
	days[(today + 7) % 7],
	days[(today + 6) % 7],
	days[(today + 5) % 7],
	days[(today + 4) % 7],
	days[(today + 3) % 7],
	days[(today + 2) % 7],
	days[(today + 1) % 7],
]

export function capitalizeWords(words) {
	words = words.split(' ').map(
		word => word.charAt(0).toUpperCase() + word.slice(1)
	)
	return words.join(' ')
}

export function getChain(days) {
	let chain = 0
	if (!days.length) return 0
	while(typeof days[chain] === 'string') {
		chain++
	}
	return chain
}

export function getLongestChain(days) {
	let current_chain = 0
	let longest_chain = 0
	days.forEach(day => {
		if (day !== false) {
			current_chain++
		} else {
			if (current_chain > longest_chain) {
				longest_chain = current_chain
			}
			current_chain = 0
		}
	})
	// single value non-false array edge case
	if (current_chain > longest_chain) {
		longest_chain = current_chain
	}
	return longest_chain
}


export function getDate(days_ago, from_date) {
	if (days_ago < 0) days_ago *= -1
	return moment(from_date)
		.subtract(days_ago, 'days')
		.valueOf()
}

export function convertDatumToHabit(datum) {
	let habit = {}

	// get the name from different datum formats
	if (datum.hasTag('daily')) {
		habit.name = datum.getValue('daily')
	} else if (datum.hasTag('habit')) {
		if (datum.hasValue('habit')) {
			habit.name = datum.getValue('habit')
		} else {
			habit.name = datum.getTagsOtherThan('habit')[0]
		}
	} else {
		console.error('Unable to convert datum into habit object')
	}
	habit.name = capitalizeWords(habit.name)

	// how many days ago from today? an integer
	const now = moment().dayOfYear()
	const then = moment(datum.getTime()).dayOfYear()
	habit.relative_date = now - then

	// remember the id for when we delete this habit
	habit.id = datum.id

	return habit
}

function reduceDatumsToHabits(datums) {

	let habits = datums.map(datum => convertDatumToHabit(datum))

	// convert list of habit_dates to habit-dates pairs
	let groupedHabits = habits.reduce((group, habit) => {
		let days = group[habit.name]
		if (days === undefined) days = []

		// if new oldest day added, pad days with false until completed_date_id
		const difference = habit.relative_date - days.length
		if (difference > 0) {
			let new_days = Array(difference).fill(false).concat(habit.id)
			days = days.concat(new_days)
		} else {
			days[habit.relative_date] = habit.id
		}

		group[habit.name] = days
		return group
	}, {})

	return groupedHabits
}

export default function Habits(props) {
	let [text, setText ] = React.useState('')
	const classes = useStyles()

	function toggleChecked(habit, day, completed_id) {
		if (completed_id) {
			//console.log('TODO: delete completed day')
			props.onUncheckDay(completed_id)
		} else {
			const dateOfCheckbox = getDate(day, Date.now())
			const newHabitEntry = new Datum(
				uuid(),
				dateOfCheckbox,
				[{ name: 'habit', value: habit}]
			)
			props.onCheckDay(newHabitEntry)
		}
	}

	function onSubmitHabit(e) {
		e.preventDefault()
		props.onAddHabit([{
			name: 'habit',
			value: text,
		}])
		setText('')
	}

	function onChangeHabitTextField(e) {
		setText(e.target.value)
	}

	function Checkboxes({days, habit}) {
		let cells = []
		for (let i = 0; i < 7; i++) {
			cells.push(
				<TableCell key={i} className={classes.checkbox_cell} align='center'>
					<Checkbox
						checked={typeof days[i] === 'string'}
						onClick={() => toggleChecked(habit, i, days[i])}
					/>
				</TableCell>
			)
		}
		return cells
	}
	
	function DayRows() {
		const habits = reduceDatumsToHabits(props.habits)
		let rows = []
		for (let name in habits) {
			rows.push(
			<TableRow key={name}>
				<TableCell className={classes.name} component='th' scope='row'>
					{name}
				</TableCell>
				<TableCell className={classes.icon_cell} align='center'>
					{getChain(habits[name])}
				</TableCell>
				<TableCell className={classes.icon_cell} align='center'>
					{getLongestChain(habits[name])}
				</TableCell>

				<Checkboxes
					days={habits[name]}
					habit={name}
				/>
			</TableRow>
			)
		}
		return rows
	}

	const header_cells = last_seven_days.map(d => (
		<TableCell key={d} className={classes.header_cell} align='center'>{d}</TableCell>
	))

	const app_btn = (
		<div className={classes.todoBar}>
		<form onSubmit={e => onSubmitHabit(e)}>
			<TextField 
				className={classes.todoTextField} 
				onChange={e => onChangeHabitTextField(e)}
				value={text}
				label='Habit' 
				placeholder='New Habit' 
				variant='outlined' 
				size='small' 
				color='secondary'
			/>
		</form>
		<Fab
			onClick={props.onButtonLongPress}
			onContextMenu={props.onButtonLongPress} // capture long press & right click
			onDoubleClick={props.onButtonLongPress}
			className={classes.fab}
			color='primary'
			size='small'
		>
			<MenuIcon />
		</Fab>
	</div>
)
	
	// TODO: place separate table with name and count before
	//       days, with days scrolled off as far as oldest
	//       habit

  return (
		<div className={classes.container}>

			<TableContainer className={classes.tableContainer} component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					
					<TableHead>
						<TableRow>
							<TableCell align='left'>Habit</TableCell>
							<TableCell className={classes.icon_cell} fontSize='small' align='center'><LinkIcon /></TableCell>
							<TableCell className={classes.icon_cell} fontSize='small' align='center'><GradeIcon /></TableCell>
							{header_cells}
						</TableRow>
					</TableHead>

					<TableBody>
						<DayRows />
					</TableBody>

				</Table>
			</TableContainer>

			{app_btn}
		</div>
  );
}