import React from 'react'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@material-ui/core'
import CancelIcon from '@material-ui/icons/CancelRounded'
import { withStyles } from '@material-ui/core/styles'

const styles = {
	left_icon: {
		marginRight: '0.25em',
	},
	title: {
		color: '#ff5050',
		fontSize: '3em',
	},
	section: {
		color: '#1a1a1a',
		textIndent: '1em',
		maxWidth: '20em',
		'& a': {
			color: '#ff3030',
			textDecoration: 'none',
			'& hover': {
				borderBottom: '1px dashed #ff3030'
			}
		}
	}
}

function ImportExport(props) {
	const { classes } = props

	return (
		<div>
			<Dialog
				open={props.open}
				onClose={props.handle_close}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle className={classes.title} id="alert-dialog-title">{'Datum is for your personal data.'}</DialogTitle>
				<DialogContent>
					<DialogContentText className={classes.section} id="alert-dialog-description">
						{'Whether it\'s your to-do list, financials, calories or private notes, Datum let\'s you—and only you—see your data how you want. Datom does not, and will never, look at or sell your data.'}
					</DialogContentText>
					<DialogContentText className={classes.section} id="alert-dialog-description">
					Datum is made by Travis Kohlbeck. Please send questions, comments, issues, etc. to <code><span>me</span><span>@</span><span>travisk.info</span></code>. Source code can be found at <a href='https://github.com/travisk-codes/datum-app'>GitHub</a>. Donations are accepted on <a href='https://patreon.com/homaro'>Patreon</a>.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={props.handle_close} color="secondary" autoFocus>
						<CancelIcon className={classes.left_icon} />
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default withStyles(styles)(ImportExport)
