import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
} from 'react'
import { List } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { VariableSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import Datum from './Datum'

const styles = {
	datum_list: {
		position: 'fixed',
		top: 0,
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

	const getItemSize = index => 62
	const listRef = useCallback(node => {
		try {
			if (node !== null) node.scrollToItem(p.datums.length)
		} catch(e) {
			console.error(e)
		}
	})
	if (!p.datums.length) return <List ref={listRef} dense></List>
	return (
		<div className={classes.datum_list}>
			<AutoSizer>
				{({ width, height }) => (
					<VariableSizeList
						height={height}
						width={width}
						itemSize={getItemSize}
						itemCount={p.datums.length}
						itemData={p}
						ref={listRef}
					>
						{renderDatums}
					</VariableSizeList>
				)}
			</AutoSizer>
		</div>
	)
}

export default withStyles(styles)(DatumList)
