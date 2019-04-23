import React, { Component } from 'react'
import RxDB from 'rxdb'
import idb from 'pouchdb-adapter-idb'
import http from 'pouchdb-adapter-http'
import uuid from 'uuid/v4'

import {
	CssBaseline,
	Fab,
} from '@material-ui/core'
import {
	MuiThemeProvider,
	createMuiTheme,
	withStyles,
} from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/AddRounded'

import DatumBar from './DatumBar'
import DatumList from './DatumList'
import Splash from './Splash'

import { datum_schema, tag_schema } from './schemas'
import secret from './secret'

const log = x => console.log(x)
const empty_datum = () => ({ id: null, time: null, tags: [] })

RxDB.plugin(idb)
RxDB.plugin(http)

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#f5f5f5',
			contrastText: '#1a1a1a',
		},
		secondary: {
			main: '#ff2626',
			contrastText: '#fafafa',
		},
	},
	// hide error
	typography: {
		useNextVariants: true,
	},
})

const styles = {
	fab: {
		position: 'fixed',
		right: 5,
		bottom: 5,
	},
}

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			datums: [],
			tags: [],
			stashed_datum: null,
			active_datum: {
				id: null,
				time: null,
				tags: [],
			},
			datum_bar_input_val: '',
			is_datum_bar_menu_open: false,
			current_view: 'datum_list',
		}
		this.subs = []
		this.add_datum = this.add_datum.bind(this)
		this.del_datum = this.del_datum.bind(this)
		this.edit_datum = this.edit_datum.bind(this)
		this.add_tag = this.add_tag.bind(this)
		this.del_tag = this.del_tag.bind(this)
		this.update_datum_bar_input =
			this.update_datum_bar_input.bind(this)
		this.switch_view_to = this.switch_view_to.bind(this)
	}

	async componentDidMount() {
		const db = await RxDB.create({
			name: 'datum_app',
			adapter: 'idb',
			queryChangeDetection: true,
		})

		this.db_datums = await db.collection({
			name: 'datums',
			schema: datum_schema
		})
		const d_sub = this.db_datums
			.find()
			.sort({time: 1})
			.$.subscribe(docs => {
				if (!docs) return
				this.setState({
					datums: docs.map(
						({ id, time, tags }) => ({ id, time, tags })
					)
				})
			})
		this.subs.push(d_sub)

		this.db_tags = await db.collection({
			name: 'tags',
			schema: tag_schema,
		})
		const t_sub = this.db_tags
			.find()
			.$.subscribe(docs => {
				if (!docs) return
				this.setState({
					tags: docs.map(
						({ id, name, color, instance_times,
							 instance_peers, instance_values }) =>
						({ id, name, color, instance_times,
							 instance_peers, instance_values })
					)
				})
			})
		this.subs.push(t_sub)
	}

	componentWillUnmount() {
		this.subs.forEach(sub => sub.unsubscribe())
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.state !== nextState) return true
		return false
	}

	update_tag_metadata(datum) {
		datum.tags.map(t => {
			let tag_already_exists
			let new_data = this.state.tags.map(
				(tag_metadata, i) => {
					if (tag_metadata.name === t.name) {
						tag_already_exists = true
						new_data = tag_metadata
						if (
							new_data.instance_times.inlogudes(datum.time)
						) {
							const idx = new_data.instance_times.indexOf(
								datum.time
							)
							new_data.instance_peers[idx] = datum.tags
							new_data.instance_values[idx] = t.value
						} else {
							new_data.instance_times.push(datum.time)
							new_data.instance_peers.push(datum.tags)
							new_data.instance_values.push(t.value)
						}
						let new_tags = this.state.tags
						new_tags[i] = new_data
						this.setState({
							tags: new_tags,
						})
					}
				}
			)
			if (tag_already_exists === false) {
				new_data = {
					id: uuid(),
					name: t.name,
					color: 'black', // TODO get_random_color_scheme() ?
					instance_times: [datum.time],
					instance_peers: [datum.tags],
					instance_values: [t.value],
				}
				this.setState({
					tags: [...this.state.tags, new_data],
				})
			}
		})
	}

	async add_datum(e) {
		e.preventDefault()
		let { datums, active_datum, stashed_datum } = this.state
		if (!active_datum.tags.length) return

		if (active_datum.id) { // already exists
			datums = datums.map(d => d.id === active_datum.id ?
				active_datum : d
			)
		} else {
			active_datum.id = uuid()
			active_datum.time = Date.now()
			datums.push(active_datum)
		}

		await this.db_datums.upsert(active_datum)
		this.update_tag_metadata(active_datum)

		// load empty or stashed datum in datum bar
		if (stashed_datum) {
			active_datum = stashed_datum
			stashed_datum = null
		} else {
			active_datum = empty_datum()
		}

		this.setState({
			datums,
			stashed_datum,
			active_datum,
			datum_bar_input_val: '',
			is_datum_bar_menu_open: false,
			current_view: 'datum_list',
		})

		// scroll to new datum at end of list
		window.setTimeout(() => {
			window.scrollTo({
				top: document.body.scrollHeight,
				left: 0,
				behavior: 'smooth',
			})
		}, 100) // give state some time to update before scroll, janky solution :/
	}

	async del_datum(id) {
		this.setState(state => ({
			datums: state.datums.filter(datum => datum.id !== id),
		}))
		const datum_to_delete = await this.db_datums
			.findOne()
			.where('id')
			.eq(id)
			.exec()
		datum_to_delete.remove()
		console.log(`datum ${id} deleted`)
	}

	edit_datum(id) {
		console.log(`editing datum ${id}`)
		this.setState({
			stashed_datum: this.state.active_datum,
			active_datum: this.state.datums
				.filter(d => d.id === id)
				.pop(),
		})
	}

	add_tag(tag) {
		let tagName, tagValue
		const split = tag.indexOf(':')
		if (split > 0) {
			tagName = tag.substring(0, split)
			tagValue = tag.substring(split + 1)
		} else {
			tagName = tag
			tagValue = ''
		}
		this.setState(state => ({
			active_datum: {
				...state.active_datum,
				tags: state.active_datum.tags.concat({
					name: tagName,
					value: tagValue,
				}),
			},
			datum_bar_input_val: '',
		}))
	}

	del_tag = (tag, index) => this.setState({
		active_datum: {
			...this.state.active_datum,
			tags: this.state.active_datum.tags
				.filter((tag, i) => i !== index),
		}
	})

	update_datum_bar_input = e => this.setState({
		datum_bar_input_val: e.target.value,
	})

	switch_view_to = view => this.setState({
		current_view: view,
	})

	render() {
		const splash = (
			<Splash
			switch_view_to={this.switch_view_to}
			on_login={this.load_db}
		/>

		)
		const datum_bar = (
			<form onSubmit={this.add_datum}>
			<DatumBar
				value={this.state.active_datum.tags.map(
					tag => `${tag.name}:${tag.value}`
				)}
				onAddTag={this.add_tag}
				onDeleteTag={this.del_tag}
				is_tag_menu_open={this.state.is_datum_bar_menu_open}
				on_focus={() => this.setState({
					is_datum_bar_menu_open: true,
				})}
				on_blur={() => this.setState({
					is_datum_bar_menu_open: false,
				})}
				InputProps={{
					onChange: this.update_datum_bar_input,
					value: this.state.datum_bar_input_val,
				}}
			/>
		</form>
		)
		const { classes } = this.props
		return (
			<MuiThemeProvider theme={theme}>
				<CssBaseline />

				<DatumList
					datums={this.state.datums}
					onSelectEdit={this.edit_datum}
					onSelectDelete={this.del_datum}
				/>
				{datum_bar}

				<Fab
					onClick={this.add_datum}
					className={classes.fab}
					color='primary'
					size='small'
				><AddIcon /></Fab>

			</MuiThemeProvider>
		)
	}
}

export default withStyles(styles)(App)
