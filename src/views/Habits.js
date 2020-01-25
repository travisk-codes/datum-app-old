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
import { stringify } from '../utils/getTagColor';

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
	}
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
function capitalizeWord(word) {
	return word.charAt(0).toUpperCase() + word.slice(1)
}


export default function Habits(props) {
	const classes = useStyles()
	
	function renderRows() {
		let rows = []
		props.habits.forEach(h => {
			let habit_name = capitalizeWord(h.tags[0].value)
			rows.push(
				<TableRow key={habit_name}>
					<TableCell component="th" scope="row">
						{habit_name}
					</TableCell>
					{checkbox_cells}
				</TableRow>
			)
		})
		return rows
	}

	let header_cells = days.map(d => (
		<TableCell className={classes.header_cell} align='center'>{d}</TableCell>
	))
	
	let checkbox_cells = days.map(d => (
		<TableCell className={classes.checkbox_cell} align='center'><Checkbox /></TableCell>
	))

  return (
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
  );
}