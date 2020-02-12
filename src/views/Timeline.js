import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Table from '@material-ui/core/Table';
//import TableBody from '@material-ui/core/TableBody';
//import TableCell from '@material-ui/core/TableCell';
//import TableContainer from '@material-ui/core/TableContainer';
//import TableHead from '@material-ui/core/TableHead';
//import TableRow from '@material-ui/core/TableRow';
//import Paper from '@material-ui/core/Paper';
//import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

import MenuIcon from '@material-ui/icons/AmpStoriesRounded'
//import LinkIcon from '@material-ui/icons/LinkRounded'
//import GradeIcon from '@material-ui/icons/GradeRounded'
import Fab from '@material-ui/core/Fab'
//import Datum from '../DatumClass'
//import moment from 'moment'
//import uuid from 'uuid';

const useStyles = makeStyles({
	container: {
		margin: '60px 0',
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
	},
	timelineBlock: {
		display: 'flex',
		width: '50%',
		border: '1px solid white',
		backgroundColor: 'salmon',
		color: 'white',
		borderRadius: '.25em',
		paddingLeft: '0.25em',
	},
	timelineInstant: {
		position: 'absolute',
		width: '100%',
		borderBottom: '1px solid lightgrey',
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

export function convertDatumsToBlocks(datums) {
	let heights = []
	let lastTime = 0
	let name = ''
	if (datums === undefined) return heights
	datums.forEach(datum => {
		if (datum.hasTag('stop')) {
			name = datum.getValue('stop')
		} else {
			name = ''
		}
		if (lastTime === 0) {
			lastTime = datum.time
		} else {
			const height = Math.round( // dealing with ms
				(datum.time - lastTime) / 1000 / 60
			)
			heights.push({height, name})
			lastTime = datum.time
		}
	})
	return heights
}

export function convertDatumsToInstances(datums) {
	if (datums.length <= 1) return [0]
	// filter out start/stop datums
	datums = datums.filter(d => !d.hasTag('start') || !d.hasTag('stop'))
	// save the datetime of first datum
	const time_of_first_datum = datums[0].time
	datums.shift()
	// add to array difference between datum and first dt
	let instance_heights = [0]
	datums.forEach(datum => {
		const difference = Math.round((datum.time - time_of_first_datum) / 1000 / 60)
		instance_heights.push(difference)
	})
	return instance_heights
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
			{convertDatumsToBlocks(props.items).map(({name, height}, i) => (
				<div className={classes.timelineBlock} 
					key={i}
					style={{height, backgroundColor: name === '' ? '#fafafa' : 'salmon'}}>
						{name}
					</div>
			))}
			{convertDatumsToInstances(props.datums).map((height, i) => (
				<div className={classes.timelineInstant}
					key={i}
					style={{height}}
				/>
			))}
			{app_btn}
		</div>
  );
}