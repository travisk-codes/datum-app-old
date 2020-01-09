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

import DoneIcon from '@material-ui/icons/DoneAllRounded'
import ListIcon from '@material-ui/icons/ListRounded'
import MoneyIcon from '@material-ui/icons/AttachMoneyRounded'
import StatsIcon from '@material-ui/icons/TimelineRounded'
import TimelineIcon from '@material-ui/icons/ViewDayRounded'
import HabitsIcon from '@material-ui/icons/UpdateRounded'

export default function SideMenu(props) {
	return (
		<Drawer
			anchor='right'
			open={props.open}
			onClose={props.on_close}>
				<Typography style={{fontSize: 18, padding: '1em'}}>Apps</Typography>
				<Divider />
				<List>
					<ListItem
						button
						disabled
						onClick={props.onClickList}
					>
					<ListItemIcon>
						<HabitsIcon />
					</ListItemIcon>
					<ListItemText primary='Habits' />
				</ListItem>
				<ListItem
					button
					disabled
					onClick={props.onClickList}
				>
					<ListItemIcon>
						<TimelineIcon />
					</ListItemIcon>
					<ListItemText primary='Timeline' />
				</ListItem>
				<ListItem
					button
					disabled
					onClick={props.onClickList}
				>
					<ListItemIcon>
						<StatsIcon />
					</ListItemIcon>
					<ListItemText primary='Stats' />
				</ListItem>
				<ListItem
					button
					disabled
					onClick={props.onClickList}>
					<ListItemIcon>
						<MoneyIcon />
					</ListItemIcon>
					<ListItemText primary='Money' />
				</ListItem>

				<ListItem
					button
					onClick={props.onClickList}>
					<ListItemIcon>
						<ListIcon />
					</ListItemIcon>
					<ListItemText primary='List' />
				</ListItem>

				<ListItem
					button
					onClick={props.onClickTodos}
					key='todos'>
					<ListItemIcon>
						<DoneIcon />
					</ListItemIcon>
					<ListItemText primary='Todos' />
				</ListItem>

			</List>
		</Drawer>
	)
}
