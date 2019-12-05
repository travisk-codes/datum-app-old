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
					'List',
					'Timeline',
					'Stats',
					'Finances',
					'Todos',
				].map((text, i) => (
					<ListItem button key={text}>
						<ListItemText primary={text} />
					</ListItem>
				))}
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
