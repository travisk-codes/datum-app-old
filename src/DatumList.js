import React, { useState, useEffect, useRef } from 'react'
import { List } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { VariableSizeList } from 'react-window'
import Datum from './Datum'

const styles = {
	datum_list: {
		//marginTop: 60, // TODO: set dynamically to app bar height
		marginBottom: 46, // for datum bar
		overflow: 'hidden', // for scaling datums with open menus
		//position: 'fixed',
		//width: '100%',
		//bottom: 0,
		'& li': {
			listStyle: 'none',
		},
	},
}

function renderDatums(props) {
	const [height, setHeight] = useState(62)
	const ref = useRef(null)

	useEffect(() => {
		if (ref.current.clientHeight !== 62)
			setHeight(ref.current.clientHeight)
	})
	const { index, style, data, ...p } = props
	return (
		<div style={style} ref={ref}>
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
	if (!p.datums.length) return <List dense></List>
	return (
		<div className={classes.datum_list}>
			<VariableSizeList
				height={2000}
				width={document.width}
				itemSize={62}
				itemCount={p.datums.length}
				itemData={p}
			>
				{renderDatums}
			</VariableSizeList>
		</div>
	)
}

export default withStyles(styles)(DatumList)
