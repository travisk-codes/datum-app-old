import React from 'react'
import {
<<<<<<< HEAD
	Fab,
=======
	// Fab,
>>>>>>> 905cb95... fixes errors and warnings
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
} from '@material-ui/core'

import ImportExportIcon from '@material-ui/icons/ImportExportRounded'
import HelpIcon from '@material-ui/icons/HelpRounded'
import InfoIcon from '@material-ui/icons/InfoRounded'
<<<<<<< HEAD

=======
import DoneIcon from '@material-ui/icons/DoneAllRounded'
<<<<<<< HEAD
>>>>>>> 579a9c1... Todos button in side menu opens Todos view
=======
import ListIcon from '@material-ui/icons/ListRounded'
>>>>>>> 5d7e841... Adds icon and action to Side Menu item list
// CheckCircle
// Done
// List
// Timeline

export default function SideMenu(props) {
	return (
		<Drawer
			anchor='right'
			open={props.open}
			onClose={props.on_close}
		>
			<List>
<<<<<<< HEAD
				{['Help', 'About', 'Sign Out'].map((text, i) => (
					<ListItem
						onClick={props.sign_out}
						button
						key={text}
					>
=======
				{['Help', 'About'].map((text, i) => (
					<ListItem button key={text}>
>>>>>>> 905cb95... fixes errors and warnings
						<ListItemIcon>
							{text === 'Help' ? (
								<HelpIcon />
							) : (
								<InfoIcon />
							)}
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List>
			<Divider />
			<List>
				{[
					'Habits',
					'Timeline',
					'Stats',
					'Finances',
				].map((text, i) => (
					<ListItem button key={text}>
						<ListItemText primary={text} />
					</ListItem>
				))}
				<ListItem
					button
					onClick={props.onClickList}
				>
					<ListItemIcon>
						<ListIcon />
					</ListItemIcon>
					<ListItemText primary='List' />
				</ListItem>
				<ListItem
					button
					onClick={props.onClickTodos}
					key='todos'
				>
					<ListItemIcon>
						<DoneIcon />
					</ListItemIcon>
					<ListItemText primary='Todos' />
				</ListItem>
			</List>
			<Divider />
			<List>
				{['Import/Export'].map((text, i) => (
					<ListItem
						button
						onClick={props.on_click_import_export}
						key={text}
					>
						<ListItemIcon>
							<ImportExportIcon />
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List>
		</Drawer>
	)
}
