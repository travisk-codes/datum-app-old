import React, {
	useCallback,
} from 'react'
import { List } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import Datum from '../components/Datum'

const styles = {
	datum_list: {
		position: 'fixed',
		top: 64, // for app bar
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
	const { index, style, data } = props
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

	const listRef = useCallback(node => {
		try {
			if (node !== null && p.datums.length) node.scrollToItem(p.datums.length)
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
						itemCount={p.datums.length}
						itemData={p}
						ref={listRef}
					>
						{renderDatums}
					</FixedSizeList>
				)}
			</AutoSizer>
		</div>
	)
}

export default withStyles(styles)(DatumList)
