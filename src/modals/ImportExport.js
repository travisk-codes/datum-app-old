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

import { datums_to_csv, csv_to_datums } from '../utils/csv'

import { withStyles } from '@material-ui/core/styles'

const styles = {
	left_icon: {
		marginRight: '0.25em',
	}
}

function ImportExport(props) {
	const { classes } = props

	function download_csv(datums) {
		const csv = datums_to_csv(datums)
		const blob = new Blob([csv])

		if (window.navigator.msSaveOrOpenBlob) { // msdn.microsoft.com/en-us/library/ie/hh779016.aspx
				window.navigator.msSaveBlob(blob, 'datums.csv')
		} else {
			let a = window.document.createElement('a')
			a.href = window.URL.createObjectURL(blob, {type: 'text/plain'})
			a.download = 'datums.csv'
			document.body.appendChild(a)
			a.click() // connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
			document.body.removeChild(a)
		}
	}

	function handle_user_selected_csv_file(e) {
		e.preventDefault()
		let reader = new FileReader()
		reader.onload = (file => {
			return e => {
				e.preventDefault()
				let csv_datums = e.target.result
				if (csv_datums.substring(0,4) === 'data') { // strip any metadata
					csv_datums = csv_datums.substring('data:text/csv;charset=utf-8,'.length) // wow
				}
				const datums = csv_to_datums(csv_datums)
				props.import_datums(datums)
			}
		})(e.target.files[0])
		reader.readAsText(e.target.files[0])
	}

	function import_csv() {
		document.getElementById('file-input').addEventListener('change', handle_user_selected_csv_file)
		document.getElementById('file-input').click()
		props.handle_close()
	}

	return (
		<div>
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
					<Button onClick={import_csv} color="secondary">
						<ImportIcon className={classes.left_icon} />
						Import
					</Button>
					<Button onClick={() => download_csv(props.datums)} color="secondary">
						<ExportIcon className={classes.left_icon} />
						Export
					</Button>
					<Button onClick={props.handle_close} color="secondary" autoFocus>
						<CancelIcon className={classes.left_icon} />
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			<input id="file-input" type="file" name="name" style={{display: 'none'}} />
		</div>
	)
}

export default withStyles(styles)(ImportExport)
