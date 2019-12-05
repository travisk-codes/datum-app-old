import React, { Component } from 'react'
<<<<<<< HEAD
import withFirebaseAuth from 'react-with-firebase-auth'

=======
import RxDB from 'rxdb'
import memory from 'pouchdb-adapter-memory'
import idb from 'pouchdb-adapter-idb'
import http from 'pouchdb-adapter-http'
>>>>>>> 273fe4c... gets rxdb working
import uuid from 'uuid/v4'

import { CssBaseline } from '@material-ui/core'
import {
	MuiThemeProvider,
	createMuiTheme,
} from '@material-ui/core/styles'

import DatumBar from './DatumBar'
import DatumList from './DatumList'
import Splash from './Splash'
import SideMenu from './SideMenu'
import ImportExport from './modals/ImportExport'
import { datum_schema, tag_schema } from './schemas'
import { rand_color } from './utils/getTagColor'
<<<<<<< HEAD
import init_datums from './init_datums'
import secret from './utils/secret'
import firebase from './firebase'

<<<<<<< HEAD
import 'firebase/database'

function load(app, user) {
	firebase
		.database()
		.ref(`/${user.uid}/datums`)
		.on('value', snapshot => {
			let datums_state = []
			console.log(snapshot.val())
			let datums = snapshot.val()
			for (let datum_id in datums) {
				datums_state.push({
					id: datum_id,
					tags: datums[datum_id].tags,
					time: datums[datum_id].time,
				})
			}
			datums_state.forEach(d => app.add_tag_metadata(d))
			app.setState({
				datums: datums_state,
			})
		})
}
=======
const log = x => console.log(x)
=======
//import init_datums from './init_datums'
//import secret from './secret'

//const log = x => console.log(x)
>>>>>>> 905cb95... fixes errors and warnings
const empty_datum = () => ({
	id: null,
	time: null,
	tags: [],
})
>>>>>>> 643eadb... prettifies

<<<<<<< HEAD
function add(datum, user) {
		firebase
			.database()
			.ref(`/${user.uid}/datums`)
			.push(datum)
}

function del(id, user) {
		firebase
			.database()
			.ref(`/${user.uid}/datums/${id}`)
			.remove()
	}

const log = x => console.log(x)
const empty_datum = () => ({
	id: null,
	time: null,
	tags: [],
})
=======
RxDB.plugin(idb)
RxDB.plugin(memory)
RxDB.plugin(http)
>>>>>>> 273fe4c... gets rxdb working

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

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			datums: [],
			tags: [],
			active_datum: {
				id: null,
				time: null,
				tags: [],
			},
			stashed_datum: null,
			current_view: 'splash',
			is_side_menu_open: false,
			current_modal: false,
		}
		this.add_active_datum = this.add_active_datum.bind(this)
		this.del_datum = this.del_datum.bind(this)
		this.edit_datum = this.edit_datum.bind(this)
		this.find_datum = this.find_datum.bind(this)
		this.update_datum_bar_input = this.update_datum_bar_input.bind(
			this
		)
		this.add_tag_metadata = this.add_tag_metadata.bind(this)
		this.del_tag_metadata = this.del_tag_metadata.bind(this)
		this.switch_view_to = this.switch_view_to.bind(this)
		this.get_tag_values_for = this.get_tag_values_for.bind(
			this
		)
		this.get_datum_ids = this.get_datum_ids.bind(this)
		this.toggle_side_menu = this.toggle_side_menu.bind(this)
		this.toggle_modal = this.toggle_modal.bind(this)
		this.import_datums = this.import_datums.bind(this)
		this.get_tag_names = this.get_tag_names.bind(this)
		this.get_tag_count_for = this.get_tag_count_for.bind(
			this
		)
		this.get_last_added_for = this.get_last_added_for.bind(
			this
		)
		this.userSignOut = this.userSignOut.bind(this)
	}

<<<<<<< HEAD
	componentDidMount() {
=======
	async componentDidMount() {
		const db = await RxDB.create({
			name: 'datum_app',
			adapter: 'idb',
			queryChangeDetection: true,
		})

		this.db_datums = await db.collection({
			name: 'datums',
			schema: datum_schema,
		})
		const d_subscription = this.db_datums
			.find()
			.sort({ time: 1 })
			.$.subscribe(docs => {
				if (!docs) return
				this.setState({
					datums: docs.map(({ id, time, tags }) => ({
						id,
						time,
						tags,
					})),
				})
			})
		this.subs.push(d_subscription)

		this.db_tags = await db.collection({
			name: 'tagss',
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

	componentWillUnmount() {
		this.subs.forEach(s => s.unsubscribe())
>>>>>>> 273fe4c... gets rxdb working
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.state !== nextState) return true
		if (this.props !== nextProps) {
			if (this.props.user) load(this, nextProps.user)
			return true
		}
		return false
	}

<<<<<<< HEAD
	userSignOut() {
		this.props.signOut()
		this.setState({
			current_view: 'splash',
			is_side_menu_open: false,
		})
	}

	add_tag_metadata(datum) {
=======
	async add_tag_metadata(datum) {
>>>>>>> 9404929... existing tags get color when that tag is added
		const time = datum.time
		let all_tag_data = []
		let tag_exists = []
		datum.tags.forEach(dt => {
			const name = dt.name
			const value = dt.value
			let tag_data, existence
			const existing_tag_data = this.state.tags.filter(
				st => st.name === dt.name
			)
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
		this.setState({
			tags: new_state,
		})
	}

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
<<<<<<< HEAD
		add(active_datum, this.props.user)
=======

		await this.db_datums.upsert(active_datum)
>>>>>>> 273fe4c... gets rxdb working
		this.add_tag_metadata(active_datum)

		// load empty or stashed datum in datum bar
		if (stashed_datum) {
			active_datum = stashed_datum
			stashed_datum = null
		} else {
			active_datum = empty_datum()
		}

		this.setState({
<<<<<<< HEAD
=======
			//datums,
>>>>>>> 273fe4c... gets rxdb working
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

	add_datums(new_datums) {
		const new_datum_ids = new_datums.map(d => d.id)
		let { datums } = this.state
		// default to overwriting existing datums for now
		datums = datums.filter(d => {
			if (new_datum_ids.includes(d.id)) {
				this.del_tag_metadata(d.id)
				return false
			}
			return true
		})
		datums = datums.concat(new_datums)
		this.setState({ datums })
		let updates = {}
		new_datums.forEach(d => {
			this.add_tag_metadata(d)
			const new_datum_key = firebase
				.database()
				.ref()
				.child('datums')
				.push().key
			updates['/datums/' + new_datum_key] = d
		})
		firebase
			.database()
			.ref()
			.update(updates)
	}

	async del_datum(id) {
		this.del_tag_metadata(id)
		this.setState(state => ({
			datums: state.datums.filter(datum => datum.id !== id),
		}))
<<<<<<< HEAD
		del(id, this.props.user)
=======
		const datum_to_delete = await this.db_datums
			.findOne()
			.where('id')
			.eq(id)
			.exec()
		datum_to_delete.remove()
>>>>>>> 273fe4c... gets rxdb working
		console.log(`datum ${id} deleted`)
	}

	del_datums(ids = []) {
		if (!ids.length) {
			this.setState({
				datums: [],
			})
		} else {
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

	switch_view_to = view =>
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

	get_tag_names = () => {
		return this.state.tags.map(t => t.name)
	}

	get_tag_count_for = tag => {
		return this.state.tags.filter(t => t.name === tag)[0]
			.instance_times.length
	}

	get_last_added_for = tag => {
		const tag_metadata = this.state.tags.filter(
			t => t.name === tag
		)[0]
		return tag_metadata.instance_times[
			tag_metadata.instance_times.length - 1
		]
	}

	get_datum_ids() {
		return this.state.datums.map(d => d.id)
	}

	toggle_side_menu(e) {
		e.preventDefault()
		this.setState({
			is_side_menu_open: !this.state.is_side_menu_open,
		})
	}

	toggle_modal(modal_name) {
		this.setState({ current_modal: modal_name })
	}

	import_datums(datums) {
		this.get_datum_ids().map(id =>
			this.del_tag_metadata(id)
		)
		this.del_datums()
		this.add_datums(datums)
		// TODO remove tag data
	}

	 loadDB() {
			console.log(this.props.user)
			 load(this, this.props.user)
		console.log('loaded!')
	}

	render() {
		let tag_colors = {}
		this.state.tags.forEach(({ name, color }) => {
			tag_colors[name] = color
		})
<<<<<<< HEAD
<<<<<<< HEAD
		const views = {
			splash: (
				<Splash
					switch_view_to={this.switch_view_to}
					load_db={this.loadDB}
					signIn={this.props.signInWithGoogle}
					user={this.props.user}
				/>
			),
			datum_list: (
				<>
					<SideMenu
						on_click_import_export={() =>
							this.toggle_modal('import_export')
						}
						open={this.state.is_side_menu_open}
						on_close={this.toggle_side_menu}
						sign_out={this.userSignOut}
					/>
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
						tag_colors={tag_colors}
						get_tag_names={this.get_tag_names}
						get_tag_count_for={this.get_tag_count_for}
						get_last_added_for={this.get_last_added_for}
						active_datum={this.state.active_datum}
						on_button_long_press={this.toggle_side_menu}
					/>
					<ImportExport
						open={
							this.state.current_modal === 'import_export'
								? true
								: false
						}
						handle_close={() => this.toggle_modal(false)}
						datums={this.state.datums}
						import_datums={this.import_datums}
					/>
				</>
			),
		}
		return (
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				{views[this.state.current_view]}
=======
=======
		// eslint-disable-next-line
>>>>>>> 905cb95... fixes errors and warnings
		const splash = (
			<Splash
				switch_view_to={this.switch_view_to}
				on_login={this.load_db}
			/>
		)
		return (
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				<SideMenu
					on_click_import_export={() =>
						this.toggle_modal('import_export')
					}
					open={this.state.is_side_menu_open}
					on_close={this.toggle_side_menu}
				/>
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
					tag_colors={tag_colors}
					active_datum={this.state.active_datum}
					on_button_long_press={this.toggle_side_menu}
				/>
				<ImportExport
					open={
						this.state.current_modal === 'import_export'
							? true
							: false
					}
					handle_close={() => this.toggle_modal(false)}
					datums={this.state.datums}
					import_datums={this.import_datums}
				/>
>>>>>>> 643eadb... prettifies
			</MuiThemeProvider>
		)
	}
}

const firebaseAppAuth = firebase.auth()

const providers = {
	googleProvider: new firebase.auth.GoogleAuthProvider(),
}

export default withFirebaseAuth({
	providers,
	firebaseAppAuth,
})(App)
