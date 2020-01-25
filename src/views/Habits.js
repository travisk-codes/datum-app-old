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
	days[today],
	days[today - 1],
	days[today - 2],
	days[today - 3],
	days[today - 4],
	days[today - 5],
	days[today - 6],

]
function capitalizeWord(word) {
	return word.charAt(0).toUpperCase() + word.slice(1)
}


export default function Habits(props) {
	const classes = useStyles()
	
	function renderRows() {
		return props.habits.map(h => {
			let habit_name = capitalizeWord(h.tags[0].value)
			return (
				<TableRow key={h.id}>
					<TableCell component="th" scope="row">
						{habit_name}
					</TableCell>
					{checkbox_cells}
				</TableRow>
			)
		})
	}

	let header_cells = last_seven_days.map(d => (
		<TableCell key={d} className={classes.header_cell} align='center'>{d}</TableCell>
	))
	
	let checkbox_cells = last_seven_days.map(d => (
		<TableCell key={d} className={classes.checkbox_cell} align='center'><Checkbox /></TableCell>
	))

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
						{renderRows()}
					</TableBody>
				</Table>
			</TableContainer>
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
  );
}