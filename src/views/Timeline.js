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

const datums = [
	{
		time: moment(Date.now()).valueOf(),
		tags: [
			{
				name: 'start',
				value: 'a',
			}
		]
	},
	{
		time: moment(Date.now()).add(1, 'second').valueOf(),
		tags: [
			{
				name: 'stop',
				value: 'a',
			}
		]
	}
]

const useStyles = makeStyles({
	container: {
		marginTop: 60,
		display: 'flex',
		flexDirection: 'column',
	},
	timelineItem: {
		display: 'flex',
		width: '50%',
		border: '1px solid white',
		backgroundColor: 'salmon',
		borderRadius: '.25em',
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
	},
})

export function convertDatumsToHeights(datums) {
	let heights = []
	let lastTime = 0
	if (datums === undefined) return heights
	datums.forEach(datum => {
		if (lastTime === 0) {
			lastTime = datum.time
		} else {
			const height = Math.round( // dealing with ms
				(datum.time - lastTime) / 1000 / 60
			)
			heights.push(height)
			lastTime = datum.time
			console.log(heights)
		}
	})
	return heights
}

export default function Timeline(props) {
	const classes = useStyles()

	const app_btn = (
		<div className={classes.todoBar}>
			<form onSubmit={e => console.log('ayy')}>
				<TextField 
					className={classes.todoTextField} 
					onChange={e => console.log(e.target.value)}
					value={'Test'}
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

  return (
		<div className={classes.container}>
			{convertDatumsToHeights(props.items).map(height => (
				<div className={classes.timelineItem} style={{height}}>yey</div>
			))}
			{app_btn}
		</div>
  );
}