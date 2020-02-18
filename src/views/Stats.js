import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Fab, TextField, Paper } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/AmpStoriesRounded'

const useStyles = makeStyles({
	container: {
		display: 'flex',
		position: 'fixed',
		top: 60,
		left: 0,
		right: 0,
		bottom: 56,
		flexDirection: 'column',
		alignItems: '',
		backgroundColor: '#fafafa',
		overflow: 'auto',
	},
	tagSection: {
		position: 'relative',
		padding: '1em',
		margin: '0.5em 1em',
	},
	filterBar: {
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

export default function Stats(props) {
	const classes = useStyles()

	function getTag(name) {
		return props.tags.filter(t => t.name === name)[0]
	}

	function getCount(name) {
		return getTag(name).instance_times.length
	}

	function getValues(name) {
		return getTag(name).instance_values
	}

	function getTimes(name) {
		return getTag(name).instance_times
	}

	function getUniqueValues(name) {
		let tag = props.tags.filter(t => t.name === name)[0]
		return [...new Set(tag.instance_values)]
	}

	function getSum(name) {
		let values = getValues(name)
		if (isNaN(Number(values[0]))) return 'N/A'
		return values.reduce((sum, value) => {
			sum += +value
			return sum
		}, 0)
	}

	function getAverage(name) {
		let values = getValues(name)
		if (isNaN(Number(values[0]))) return 'N/A'
		let average = values.reduce(
			(avg, value) => (avg += value / values.length),
			0,
		)
		return Number.parseFloat(average).toFixed(1)
	}

	function getFirstTime(name) {
		let values = getValues(name)
		let first_value = values.shift()
		return first_value.instance_times[0]
	}

	function getLastTime(name) {
		let values = getValues(name)
		let last_value = values.pop()
		return last_value.instance_times[0]
	}

	function getIntervals(name) {
		// duplicate the array, don't modify this.state!
		let value_times = [...getTimes(name)].sort()
		if (value_times.length === 1) return false
		let previous_time = value_times.shift()
		let intervals = []
		value_times.forEach(time => {
			intervals.push(time - previous_time)
			previous_time = time
		})
		return intervals
	}

	function getAverageInterval(name) {
		let intervals = getIntervals(name)
		if (!intervals) return 'N/A'
		let avg =
			Number.parseFloat(
				intervals.reduce(
					(average, interval) =>
						(average += interval / intervals.length),
				) /
					1000 /
					60 /
					60,
			).toFixed(1) + ' Hours'
		return avg
	}

	let counts = null
	if (props.tags.length) {
		counts = props.tags.map(tag => (
			<Paper className={classes.tagSection} key={tag.name}>
				<div>{tag.name}</div>
				<div>{`Total Count: ${getCount(tag.name)}`}</div>
				<div>{`Unique Values: ${
					getUniqueValues(tag.name).length
				}`}</div>
				<div>{`Values Sum: ${getSum(tag.name)}`}</div>
				<div>{`Average Value: ${getAverage(
					tag.name,
				)}`}</div>
				<div>{`Average Interval: ${getAverageInterval(
					tag.name,
				)}`}</div>
			</Paper>
		))
	}
	return (
		<div className={classes.container}>
			{counts}
			<div className={classes.filterBar}>
				<form onSubmit={e => console.log('ayy')}>
					<TextField
						className={classes.todoTextField}
						onChange={e => console.log(e.target.value)}
						value={''}
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
					size='small'>
					<MenuIcon />
				</Fab>
			</div>
		</div>
	)
}
