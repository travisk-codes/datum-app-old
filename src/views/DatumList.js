<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 0edcc73... fixes virtualized window bug?
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
} from 'react'
<<<<<<< HEAD
=======
import React from 'react'
>>>>>>> 905cb95... fixes errors and warnings
import { List } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { VariableSizeList } from 'react-window'
=======
import { List } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { FixedSizeList } from 'react-window'
>>>>>>> 0edcc73... fixes virtualized window bug?
import AutoSizer from 'react-virtualized-auto-sizer'
import Datum from './Datum'

const styles = {
	datum_list: {
		position: 'fixed',
		top: 56, // for app bar
		left: 0,
		right: 0,
		bottom: 46, // for datum bar
		overflow: 'hidden', // for scaling datums with open menus
		'& li': {
			listStyle: 'none',
		},
	},
}

function renderDatums(props) {
<<<<<<< HEAD
<<<<<<< HEAD
	const { index, style, data, ...p } = props
	return (
		<div style={style}>
			<Datum
				key={data.datums[index].id}
				{...data.datums[index]}
				{...data}
			/>
		</div>
=======
	const { index, style, data } = props
	return (
		//<div style={style}>{data[index].id}</div>
		<Datum
			style={style}
			key={data.datums[index].id}
			{...data.datums[index]}
			{...data}
		/>
>>>>>>> 905cb95... fixes errors and warnings
=======
	const { index, style, data, ...p } = props
	return (
		<div style={style}>
			<Datum
				key={data.datums[index].id}
				{...data.datums[index]}
				{...data}
			/>
		</div>
>>>>>>> 0edcc73... fixes virtualized window bug?
	)
}
const DatumList = props => {
	const { classes, ...p } = props
	const [height, setHeight] = useState(500)
	const ref = useRef(null)

	const getItemSize = index => 62
	const listRef = useCallback(node => {
		try {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
			if (node !== null) node.scrollToItem(p.datums.length)
<<<<<<< HEAD
		} catch(e) {
			console.error(e)
		}
	})
	if (!p.datums.length) return <List ref={listRef} dense></List>
	return (
		<div className={classes.datum_list}>
<<<<<<< HEAD
			<AutoSizer>
				{({ width, height }) => (
					<VariableSizeList
						height={height}
						width={width}
						itemSize={getItemSize}
=======
=======
			// if (node !== null) node.scrollToItem(p.datums.length)
>>>>>>> df0f6cc... fixes color flashing bug, finally
=======
			if (node !== null && p.datums.length) node.scrollToItem(p.datums.length)
>>>>>>> 2e961d6... minor changes/fixes/corrections
=======
			if (node !== null && p.datums.length) node.scrollToItem(p.datums.length)
>>>>>>> c32acd9... fixes all merge conflicts
		} catch (e) {
			console.error(e)
		}
	})
	if (!p.datums.length)
		return <List ref={listRef} dense></List>
	return (
		<div className={classes.datum_list}>
			<AutoSizer>
				{({ width, height }) => (
					<FixedSizeList
						height={height}
						width={width}
						itemSize={62}
>>>>>>> 0edcc73... fixes virtualized window bug?
						itemCount={p.datums.length}
						itemData={p}
						ref={listRef}
					>
						{renderDatums}
<<<<<<< HEAD
					</VariableSizeList>
				)}
			</AutoSizer>
=======
			<FixedSizeList
				height={2000}
				width={document.width}
				itemSize={36}
				itemCount={p.datums.length}
				itemData={p}
			>
				{renderDatums}
			</FixedSizeList>
>>>>>>> 905cb95... fixes errors and warnings
=======
					</FixedSizeList>
				)}
			</AutoSizer>
>>>>>>> 0edcc73... fixes virtualized window bug?
		</div>
	)
}

export default withStyles(styles)(DatumList)
