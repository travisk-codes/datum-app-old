import React, { useState, useEffect, useRef } from 'react'
import { List } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { VariableSizeList } from 'react-window'
import Datum from './Datum'

const styles = {
	datum_list: {
		marginBottom: 46, // for datum bar
		overflow: 'hidden', // for scaling datums with open menus
		'& li': {
			listStyle: 'none',
		},
	},
}

function renderDatums(props) {
	const { index, style, data, ...p } = props
	return (
		<div style={style}>
			<Datum
				key={data.datums[index].id}
				{...data.datums[index]}
				{...data}
			/>
		</div>
	)
}
const DatumList = props => {
	const { classes, ...p } = props
	const [height, setHeight] = useState(500)
	const ref = useRef(null)

	if (!p.datums.length) return <List dense></List>
	const getItemSize = index => 62
	/*useEffect(() => {
		if (
			height !=
			document.getElementById('datum-bar').offsetTop
		) {
			setHeight(
				document.getElementById('datum-bar').offsetTop // get height from pos of datum-bar
			)
		}
	})*/

	return (
		<div className={classes.datum_list} ref={ref}>
			<VariableSizeList
				height={
					document.getElementById('datum-bar').offsetTop
				}
				width={document.width}
				itemSize={getItemSize}
				itemCount={p.datums.length}
				itemData={p}
			>
				{renderDatums}
			</VariableSizeList>
		</div>
	)
}

export default withStyles(styles)(DatumList)
