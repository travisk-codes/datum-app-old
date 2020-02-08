import React, { Component } from 'react'
import RxDB from 'rxdb'
import memory from 'pouchdb-adapter-memory'
import idb from 'pouchdb-adapter-idb'
import http from 'pouchdb-adapter-http'
import uuid from 'uuid/v4'

import { CssBaseline } from '@material-ui/core'
import {
	MuiThemeProvider,
	createMuiTheme,
} from '@material-ui/core/styles'

import DatumList from './views/DatumList'
import Splash from './views/Splash'
import Todos from './views/Todos'
import Habits from './views/Habits'

import DatumBar from './components/DatumBar'
import TopBar from './components/TopBar'
import SideAppMenu from './components/SideAppMenu'
import SideSettingsMenu from './components/SideSettingsMenu'

import About from './modals/About'
import ImportExport from './modals/ImportExport'

import { datum_schema, tag_schema } from './schemas'
import { rand_color } from './utils/getTagColor'
import init_datums from './init_datums'
import Datum from './DatumClass'
//import secret from './secret'

//const log = x => console.log(x)
const empty_datum = () => (new Datum(null, null, []))

RxDB.plugin(idb)
RxDB.plugin(memory)
RxDB.plugin(http)

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#f5f5f5',
			contrastText: '#1a1a1a',
		},
		secondary: {
			main: '#ff3030',
			contrastText: '#fafafa',
		},
	},
	// hide error
	typography: {
		useNextVariants: true,
	},
})

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			datums: [],
			tags: [],
			active_datum: new Datum(),
			stashed_datum: null,
			current_view: 'datum_list',
			current_side_menu: false,
			current_modal: false,
		}
		this.subs = []
		this.add_active_datum = this.add_active_datum.bind(this)
		this.del_datum = this.del_datum.bind(this)
		this.del_datums = this.del_datums.bind(this)
		this.edit_datum = this.edit_datum.bind(this)
		this.find_datum = this.find_datum.bind(this)
		this.update_datum_bar_input = this.update_datum_bar_input.bind(
			this
		)
		this.add_tag_metadata = this.add_tag_metadata.bind(this)
		this.del_tag_metadata = this.del_tag_metadata.bind(this)
		this.switchViewTo = this.switchViewTo.bind(this)
		this.get_tag_values_for = this.get_tag_values_for.bind(
			this
		)
		this.switchSideMenuTo = this.switchSideMenuTo.bind(this)
		this.switchModalTo = this.switchModalTo.bind(this)
		this.importDatums = this.importDatums.bind(this)
		this.upsertDatum = this.upsertDatum.bind(this)
		this.loadLocalDB = this.loadLocalDB.bind(this)
		this.renderSplashView = this.renderSplashView.bind(this)
		this.renderDatumListView = this.renderDatumListView.bind(this)
		this.renderTodosView = this.renderTodosView.bind(this)
		this.renderHabitsView = this.renderHabitsView.bind(this)
		this.upsertTags = this.upsertTags.bind(this)
		this.getTagNames = this.getTagNames.bind(this)
		this.getTagCountFor = this.getTagCountFor.bind(this)
		this.getTagLastAddedFor = this.getTagLastAddedFor.bind(this)
		this.addDatums = this.addDatums.bind(this)
	}

	async loadLocalDB() {
		this.db_datums = await this.db.collection({
			name: 'datums',
			schema: datum_schema,
		})
		const d_subscription = this.db_datums
			.find()
			.sort({ time: 1 })
			.$.subscribe(docs => {
				if (!docs.length) {
				} else {
					this.setState({
						datums: docs.map(({ id, time, tags }) => (new Datum(id, time, tags))),
					})
				}
			})
		this.subs.push(d_subscription)

		this.db_tags = await this.db.collection({
			name: 'tags',
			schema: tag_schema,
		})
		const t_subscription = this.db_tags
			.find()
			.$.subscribe(docs => {
				if (!docs) return
				this.setState({
					tags: docs.map(
						({
							id,
							name,
							color,
							instance_times,
							instance_peers,
							instance_values,
						}) => ({
							id,
							name,
							color,
							instance_times,
							instance_peers,
							instance_values,
						})
					),
				})
			})
		this.subs.push(t_subscription)
	}

	async componentDidMount() {
		let visited = localStorage['alreadyVisited']
		if (visited) {
			this.setState({ current_modal: false })
		} else {
			this.setState({ current_modal: 'about'})
			localStorage['alreadyVisited'] = true
		}
		this.db = await RxDB.create({
			name: 'datum_app',
			adapter: 'idb',
			queryChangeDetection: true,
		})
		await this.loadLocalDB()
		if (!this.state.datums.length) {
			await this.addDatums(init_datums)
			//await this.upsertTags(init_datums)
		}
	}

	componentWillUnmount() {
		this.subs.forEach(s => s.unsubscribe())
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.state !== nextState) return true
		return false
	}

	async upsertTags(datums) {
		if (!Array.isArray(datums)) datums = [datums]

		let self = this
		function getStateIndexOfTag(tag_name) {
			self.state.tags.some((tag, i) => {
				if (tag.name === tag_name) return i
				return false
			})
		}
		
		let new_tags_data = this.state.tags
		datums.forEach(d => {
			d.tags.forEach(t => {

				let tag_data = {}
				const tag_already_exists = this.state.tags
					.filter(existing => existing.name === t.name)
				if (tag_already_exists.length) {
					tag_data = tag_already_exists.pop()
					tag_data.instance_times.push(d.time)
					tag_data.instance_peers.push(d.tags)
					tag_data.instance_values.push(t.value)
					new_tags_data[
						getStateIndexOfTag(tag_data.name)
					] = tag_data
				} else {
					tag_data = {
						id: uuid(),
						name: t.name,
						color: rand_color(),
						instance_times: [d.time],
						instance_peers: [d.tags],
						instance_values: [t.value],
					}
					new_tags_data.push(tag_data)
				}
			})
		})
		await this.db_tags.find().remove()
		await this.db_tags.bulkInsert(new_tags_data)
	}

	async add_tag_metadata(datum) {
		const time = datum.time
		let all_tag_data = []
		let tag_exists = []
		datum.tags.forEach(dt => {
			const name = dt.name
			const value = dt.value
			let tag_data, existence
			const existing_tag_data = this.state.tags
				.filter(st => st.name === dt.name)
			if (!existing_tag_data.length) {
				// create new entry for tag
				existence = false
				tag_data = {
					id: uuid(),
					name: name,
					color: rand_color(),
					instance_times: [time],
					instance_peers: [datum.tags],
					instance_values: [value],
				}
			} else {
				// append to existing entry
				existence = true
				tag_data = existing_tag_data.pop()
				tag_data.instance_times.push(time)
				tag_data.instance_peers.push(datum.tags)
				tag_data.instance_values.push(value)
			}
			all_tag_data.push(tag_data)
			tag_exists.push(existence)
		})
		// upsert the new tag data
		const old_state = this.state.tags
		let new_state = this.state.tags
		for (let i = 0; i < all_tag_data.length; i++) {
			let data = all_tag_data[i]
			await this.db_tags.upsert(data)
			if (tag_exists[i]) {
				new_state = old_state.map(t =>
					t.name === data.name ? data : t
				)
			} else {
				new_state.push(data)
			}
		}
		/*this.setState({
			tags: new_state,
		})*/
	}

	createNewDatum(tags) {
		return new Datum(
			uuid(),
			Date.now(),
			tags
		)
	}

	async upsertDatum(datum) { try {
		let { datums } = this.state
		if (datum.getId()) {
			datums = datums.map(
				d => d.id === datum.id ? datum : d
			)
		} else {
			datums.concat(datum)
		}
		
		await this.db_datums.upsert(datum)
		await this.add_tag_metadata(datum)

		/*this.setState({
			datums
		})*/
	} catch(e) {
		throw new Error(e)
	}}

	async add_active_datum(tags) {
		if (!tags.length) return
		let { datums, active_datum, stashed_datum } = this.state

		if (active_datum.id) {
			// already exists
			active_datum.tags = tags
			datums = datums.map(d =>
				d.id === active_datum.id ? active_datum : d
			)
		} else {
			active_datum.id = uuid()
			active_datum.time = Date.now()
			active_datum.tags = tags
			datums.push(active_datum)
		}

		let { id, time } = active_datum
		let old_datum_format = {
			id,
			time,
			tags,
		}

		await this.db_datums.upsert(old_datum_format)
		this.add_tag_metadata(active_datum)

		// load empty or stashed datum in datum bar
		if (stashed_datum) {
			active_datum = stashed_datum
			stashed_datum = null
		} else {
			active_datum = empty_datum()
		}

		this.setState({
			//datums,
			stashed_datum,
			active_datum,
		})

		// scroll to new datum at end of list
		/*window.setTimeout(() => {
			window.scrollTo({
				top: document.body.scrollHeight,
				left: 0,
				behavior: 'smooth',
			})
		}, 100) // give state some time to update before scroll, janky solution :/*/
	}

	async addDatums(new_datums) {
		this.setState({ new_datums })
		const new_datum_ids = new_datums.map(d => d.id)
		// default to overwriting existing datums for now
		this.state.datums.forEach(d => {
			if (new_datum_ids.includes(d.id)) {
				this.del_tag_metadata(d.id)
				return false
			}
			return true
		})
		await this.upsertTags(new_datums)
		await this.db_datums.bulkInsert(new_datums)
		//datums = datums.concat(new_datums)
		//this.setState({ datums })
	}

	async del_datum(id) {
		const datum_to_delete = await this.db_datums
			.findOne()
			.where('id')
			.eq(id)
			.exec()
		datum_to_delete.remove()
		this.del_tag_metadata(id)
		this.setState(state => ({
			datums: state.datums.filter(datum => datum.id !== id),
		}))
		console.log(`datum ${id} deleted`)
	}

	async del_datums(ids = []) {
		if (!ids.length) {
			this.setState({
				datums: [],
				tags: [],
			})
			await this.db_datums.remove()
			await this.db_tags.remove()
			await this.loadLocalDB()
		} else {
			// TODO remove its tags metadata
			this.setState({
				datums: this.state.datums.filter(
					d => !ids.includes(d.id)
				),
			})
		}
	}

	del_tag_metadata(datum_id) {
		const datum_to_delete = this.state.datums
			.filter(d => d.id === datum_id)
			.pop()
		const tags_to_delete = datum_to_delete.tags
		const instance_time = datum_to_delete.time
		let new_state = this.state.tags
		tags_to_delete.forEach(dt => {
			try {
				let tag_data = this.state.tags
					.filter(st => st.name === dt.name)
					.pop()
				if (tag_data.instance_times.length === 1) {
					// remove entire tag obj if one left
					new_state = new_state.filter(
						t => t.name !== dt.name
					)
				} else {
					// remove instances from tag obj
					const index = tag_data.instance_times.findIndex(
						time => time === instance_time.toString()
					)
					tag_data.instance_times.splice(index, 1)
					tag_data.instance_peers.splice(index, 1)
					tag_data.instance_values.splice(index, 1)
					new_state = new_state.map(t =>
						t.name === dt.name ? tag_data : t
					)
				}
			} catch (e) {
				console.log(e)
			}
		})
		this.setState({
			tags: new_state,
		})
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

	find_datum(id) {
		return this.state.datums.filter(d => d.id === id).pop()
	}

	update_datum_bar_input = e =>
		this.setState({
			datum_bar_input_val: e.target.value,
		})

	switchViewTo = view =>
		this.setState({
			current_view: view,
		})

	get_tag_values_for = tag_name => {
		const tag_data = this.state.tags
			.filter(t => t.name === tag_name)
			.pop() // always gotta pop the filter
		if (!tag_data) return null
		if (tag_data.instance_values) {
			return [...new Set(tag_data.instance_values)]
		} else {
			return null
		}
	}

	switchSideMenuTo(menu_name) {
		this.setState({
			current_side_menu: menu_name,
		})
	}

	switchModalTo(modal_name) {
		this.setState({ current_modal: modal_name })
	}

	async importDatums(datums) {
		 await this.del_datums()
		 await this.addDatums(datums)
		// TODO remove tag data
	}

	getTagNames() {
		return this.state.tags.map(t => t.name)
	}

	getTagCountFor(tag) {
		return this.state.tags
			.filter(t => t.name === tag)[0]
			.instance_times
			.length
	}

	getTagLastAddedFor(tag) {
		const tag_metadata = this.state.tags
			.filter(t => t.name === tag)[0]
		return tag_metadata.instance_times[
			tag_metadata.instance_times.length - 1
		]
	}

	renderAboutView() {
		return <About />
	}

	renderSplashView() {
		return (
			<Splash
				switchViewTo={this.switchViewTo}
				on_login={this.load_db}
			/>
		)
	}

	renderDatumListView() {
		const tag_colors = {}
		this.state.tags.forEach(t => {
			tag_colors[t.name] = t.color
		})
		return (
			<>
				<DatumList
					datums={this.state.datums}
					tag_colors={tag_colors}
					onSelectEdit={this.edit_datum}
					onSelectDelete={this.del_datum}
				/>
				<DatumBar
					on_add_tag={this.add_tag}
					on_del_tag={this.del_tag}
					on_add_datum={this.add_active_datum}
					get_tag_values_for={this.get_tag_values_for}
					getTagNames={this.getTagNames}
					getTagCountFor={this.getTagCountFor}
					getTagLastAddedFor={this.getTagLastAddedFor}
					tag_colors={tag_colors}
					addTagColor={this.addTagColor}
					active_datum={this.state.active_datum}
					on_button_long_press={() => this.switchSideMenuTo('apps')}
				/>
			</>
		)
	}

	renderTodosView() {
		return (
			<Todos 
				todoItems={this.state.datums.filter(
					d => d.hasTag('todo')
				)}
				onToggleTodo={this.upsertDatum}
				onSelectEdit={this.edit_datum}
				onSelectDelete={this.del_datum}
				onButtonLongPress={() => this.switchSideMenuTo('apps')}
				onAddTodo={tags => this.upsertDatum(this.createNewDatum(tags))}
			/>
		)
	}

	renderHabitsView() {
		return (
			<Habits
				habits={this.state.datums.filter(
					d => d.hasTag('daily') || d.hasTag('habit')
				)}
				onCheckDay={this.upsertDatum}
				onUncheckDay={this.del_datum}
				onAddHabit={tags => this.upsertDatum(this.createNewDatum(tags))}
				onButtonLongPress={() => this.switchSideMenuTo('apps')}
			/>
		)
	}

	render() {
		const	CurrentView = {
			'splash': this.renderSplashView,
			'datum_list': this.renderDatumListView,
			'todos': this.renderTodosView,
			'about': this.renderAboutView,
			'habits': this.renderHabitsView,
		}[this.state.current_view]

		return (
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				<TopBar onOpenSettingsMenu={() => this.switchSideMenuTo('settings')}/>
				<SideAppMenu
					onClickTodos={() => this.switchViewTo('todos')}
					onClickHabits={() => this.switchViewTo('habits')}
					onClickList={() => this.switchViewTo('datum_list')}
					open={this.state.current_side_menu === 'apps'}
					on_close={() => this.switchSideMenuTo(false)}
				/>
				<SideSettingsMenu
					onClickImportExport={() => this.switchModalTo('import_export')}
					onClickAbout={() => this.switchModalTo('about')}
					on_close={() => this.switchSideMenuTo(false)}
					onClickClearData={this.del_datums}
					open={this.state.current_side_menu === 'settings'}
				/>
				<CurrentView view={this.state.current_view} />
				<About 
					open={
						this.state.current_modal === 'about'
							? true
							: false
					}
					handle_close={() => this.switchModalTo(false)}
				/>
				<ImportExport
					open={
						this.state.current_modal === 'import_export'
							? true
							: false
					}
					handle_close={() => this.switchModalTo(false)}
					datums={this.state.datums}
					importDatums={this.importDatums}
				/>
			</MuiThemeProvider>
		)
	}
}

export default App
