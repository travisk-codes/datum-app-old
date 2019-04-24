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
import { rand_color } from './utils/getTagColor'
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
		this.update_tag_metadata = this.update_tag_metadata.bind(this)
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
			.sort({ time: 1 })
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
							({
								id, name, color, instance_times,
								instance_peers, instance_values
							})
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

	async update_tag_metadata(datum) {
		const time = datum.time
		let all_tag_data = []
		let tag_exists = []
		datum.tags.map(dt => {
			const name = dt.name
			const value = dt.value
			let tag_data, existence
			const existing_tag_data = this.state.tags
				.filter(st => st.name === dt.name)
			if (!existing_tag_data.length) {
				existence = false
				tag_data = {
					id: uuid(),
					name: name,
					color: rand_color()[500],
					instance_times: [time],
					instance_peers: [datum.tags],
					instance_values: [value]
				}
			} else {
				existence = true
				tag_data = existing_tag_data.pop()
				tag_data.instance_times.push(time)
				tag_data.instance_peers.push(datum.tags)
				tag_data.instance_values.push(value)
			}
			all_tag_data.push(tag_data)
			tag_exists.push(existence)
		})
		const old_state = this.state.tags
		let new_state = []
		for (let i = 0; i < all_tag_data.length; i++) {
			let data = all_tag_data[i]
			await this.db_tags.upsert(data)
			if (tag_exists[i]) {
				new_state = old_state.map(t =>
					t.name === data.name ?
						data : t
				)
			} else {
				new_state.push(data)
			}
		}
		this.setState({
			tags: new_state
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
		const { classes } = this.props
		let tag_colors = {}
		this.state.tags.map(
			({ name, color }) => { tag_colors[name] = color }
		)
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
					tag_colors={tag_colors}
					InputProps={{
						onChange: this.update_datum_bar_input,
						value: this.state.datum_bar_input_val,
					}}
				/>
			</form>
		)
		return (
			<MuiThemeProvider theme={theme}>
				<CssBaseline />

				<DatumList
					datums={this.state.datums}
					tag_colors={tag_colors}
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
