import React from 'react'
import {
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@material-ui/core'

import ImportExportIcon from '@material-ui/icons/ImportExportRounded'
import HelpIcon from '@material-ui/icons/HelpRounded'
import InfoIcon from '@material-ui/icons/InfoRounded'
import DoneIcon from '@material-ui/icons/DoneAllRounded'
import ListIcon from '@material-ui/icons/ListRounded'
import MoneyIcon from '@material-ui/icons/AttachMoneyRounded'
import StatsIcon from '@material-ui/icons/TimelineRounded'
import TimelineIcon from '@material-ui/icons/ViewDayRounded'
import HabitsIcon from '@material-ui/icons/UpdateRounded'
import ClearIcon from '@material-ui/icons/ClearRounded'

export default function SideMenu(props) {
	return (
		<Drawer
			anchor='right'
			open={props.open}
			onClose={props.on_close}
		>
			<Typography style={{fontSize: 18, padding: '1em'}}>Settings</Typography>
			<Divider />
			<List>
			<ListItem
					button
					disabled
					onClick={props.onClickList}
				>
					<ListItemIcon>
						<HelpIcon />
					</ListItemIcon>
					<ListItemText primary='Help' />
				</ListItem>
				<ListItem
					button
					key='about'
					onClick={props.onClickAbout}
				>
					<ListItemIcon>
						<InfoIcon />
					</ListItemIcon>
					<ListItemText primary='About' />
				</ListItem>
			</List>
			<Divider />
			<List>
				{['Import/Export'].map((text, i) => (
					<ListItem
						button
						onClick={props.onClickImportExport}
						key={text}
					>
						<ListItemIcon>
							<ImportExportIcon />
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
				<ListItem
					button
					onClick={props.onClickClearData}
				>
					<ListItemIcon>
						<ClearIcon />
					</ListItemIcon>
					<ListItemText primary='Clear Data' />
				</ListItem>

			</List>
		</Drawer>
	)
}
