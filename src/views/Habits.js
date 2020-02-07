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
import MenuIcon from '@material-ui/icons/AmpStoriesRounded'
import Fab from '@material-ui/core/Fab'
import moment from 'moment'
import Datum from '../DatumClass'
import uuid from 'uuid';

const useStyles = makeStyles({
  table: {
		//minWidth: 650,
		marginTop: 60,
	},
	header_cell: {
		paddingLeft: 0,
		paddingRight: 0,
	},
	checkbox_cell: {
		paddingLeft: 0,
		paddingRight: 0,
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

function capitalizeWord(word) {
	return word.charAt(0).toUpperCase() + word.slice(1)
}

export function getDate(days_ago, from_date) {
	console.log('getDate')
	if (days_ago < 0) days_ago *= -1
	return moment(from_date)
		.subtract(days_ago, 'days')
		.valueOf()
}

function convertDatumToHabit(datum) {
	console.log('convertDatumToHabit')
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

	// how many days ago from today? an integer
	const now = moment().dayOfYear()
	const then = moment(datum.getTime()).dayOfYear()
	habit.relative_date = now - then

	// remember the id for when we delete this habit
	habit.id = datum.id

	return habit
}

function reduceDatumsToHabits(datums) {
	console.log('reduceDatumToHabit')

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


	function Checkboxes({days, habit}) {
		console.log('render Checkboxes')
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
	
	function Rows() {
		console.log('render Rows')
		const habits = reduceDatumsToHabits(props.habits)
		console.log(habits)
		let rows = []
		for (let name in habits) {
			rows.push(
			<TableRow key={name}>
				<TableCell component='th' scope='row'>
					{capitalizeWord(name)}
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

	// 

	const header_cells = last_seven_days.map(d => (
		<TableCell key={d} className={classes.header_cell} align='center'>{d}</TableCell>
	))

	const app_btn = (
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
	)
	

  return (
		<div>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					
					<TableHead>
						<TableRow>
							<TableCell align='left'>Habit</TableCell>
							{header_cells}
						</TableRow>
					</TableHead>

					<TableBody>
						<Rows />
					</TableBody>

				</Table>
			</TableContainer>
			{app_btn}
		</div>
  );
}