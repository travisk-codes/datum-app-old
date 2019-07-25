import React from 'react'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@material-ui/core'

import ImportIcon from '@material-ui/icons/ArrowDownwardRounded'
import ExportIcon from '@material-ui/icons/ArrowUpwardRounded'
import CancelIcon from '@material-ui/icons/CancelRounded'

import { withStyles } from '@material-ui/core/styles'

const styles = {
	left_icon: {
		marginRight: '0.25em',
	}
}
function ImportExport(props) {
	const { classes } = props

	return (
		<Dialog
			open={props.open}
			onClose={props.handle_close}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{'Import or export your data to .csv?'}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{'When importing data, all current data will be lost. Filetype must be comma-separated values (.csv)'}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.handle_close} color="secondary">
					<ImportIcon className={classes.left_icon} />
					Import
				</Button>
				<Button onClick={props.handle_close} color="secondary">
					<ExportIcon className={classes.left_icon} />
					Export
				</Button>
				<Button onClick={props.handle_close} color="secondary" autoFocus>
					<CancelIcon className={classes.left_icon} />
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default withStyles(styles)(ImportExport)
