import React, { Component } from 'react'
import * as RxDB from 'rxdb'
import PouchDB from 'pouchdb'
import auth from 'pouchdb-authentication'
import idb from 'pouchdb-adapter-idb'
import http from 'pouchdb-adapter-http'
import uuid from 'uuid/v4'

import DB from './utils/db'

import {
	AppBar,
	CssBaseline,
	Toolbar,
	Fab,
} from '@material-ui/core'
import {
	MuiThemeProvider,
	createMuiTheme,
} from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/AddRounded'

import DatumBar from './DatumBar'
import DatumList from './DatumList'
import Splash from './Splash'

//import datums from './datums'
import logo from './datum-logo.svg'
import { datum_schema, tag_schema } from './schemas'
import secret from './secret'

const cl = x => console.log(x)

PouchDB.plugin(auth)
PouchDB.plugin(idb)
PouchDB.plugin(http)

RxDB.plugin(require('pouchdb-adapter-idb'))
RxDB.plugin(require('pouchdb-adapter-http'))
RxDB.plugin(auth)

const sync_url = secret.db_url
const db_name = 'datums'

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

const TopBar = () => (
	<AppBar position='fixed'>
		<Toolbar>
			<img
				src={logo}
				alt='logo'
				style={{
					height: 34,
				}}
			/>
		</Toolbar>
	</AppBar>
)

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			datums: [],
			tags: [],
			stashedDatum: null,
			active_datum: {
				id: null,
				time: null,
				tags: [],
			},
			datumBarInputValue: '',
			is_datum_bar_tag_menu_open: false,
			current_view: 'splash',
		}
		this.subs = []
		this.addDatum = this.addDatum.bind(this)
		this.deleteDatum = this.deleteDatum.bind(this)
		this.editDatum = this.editDatum.bind(this)
		this.addTag = this.addTag.bind(this)
		this.deleteTag = this.deleteTag.bind(this)
		this.updateDatumBarInput = this.updateDatumBarInput.bind(
			this
		)
		this.create_collections_and_sync = this.create_collections_and_sync.bind(
			this
		)
		this.switch_view_to = this.switch_view_to.bind(
			this
		)
		this.handle_sign_up = this.handle_sign_up.bind(this)
		this.handle_login = this.handle_login.bind(this)
		this.load_db = this.load_db.bind(this)
	}

	async componentDidMount() {
		this.db = new DB(
			secret.db_url,
			[
				{ name: 'datums', schema: datum_schema },
				{ name: 'tags', schema: tag_schema },
			]
		)
		//this.db = await this.create_db()
		/*const d_sub = this.db.datums
			.find()
			.sort({ time: 1 })
			.$.subscribe(docs => {
				if (!docs) return
				this.setState({
					datums: docs.map(d => ({
						id: d.id,
						time: d.time,
						tags: d.tags,
					})),
				})
			})
		const t_sub = this.db.tags.find().$.subscribe(docs => {
			if (!docs) return
			this.setState({
				tags: docs.map(t => ({
					id: t.id,
					name: t.name,
					color: t.color,
					times: t.instance_times,
					peers: t.instance_peers,
					values: t.instance.values,
				})),
			})
		})
		this.subs.push(d_sub)
		this.subs.push(t_sub)*/
	}

	async componentWillUnmount() {
		await this.db.logout().then(() => 'logging out!')
		this.subs.forEach(sub => sub.unsubscribe())
	}

	async load_db(username, password, is_signing_up) {
		await this.db.logout()
		if (is_signing_up) await this.db.signup(username, password)
		await this.db.login(username, password)
		await this.db.load(username)
		const cb = (docs) => {
			this.setState({
				datums: docs.map(d => ({
					id: d.id,
					time: d.time,
					tags: d.tags,
				}))
			})
		}
		await this.db.get_all_docs(cb)
		/*this.setState({
			tags: tags ? tags.map(({
				id,
				name,
				color,
				instance_peers,
				instance_times,
				instance_values,
			}) => ({
				id,
				name,
				color,
				instance_peers,
				instance_times,
				instance_values,
			})) : [],
			datums: datums ? datums.map(({
				id,
				time,
				tags,
			}) => ({
				id,
				time,
				tags,
			})) : [],
		})*/
	}

	async create_collections_and_sync(url, db_name) {
		const db = await RxDB.create({
			name: db_name,
			adapter: 'idb',
			//password: secret.db_password,
			queryChangeDetection: true,
			pouchSettings: {
				//skip_setup: true,
			},
		})
		db.waitForLeadership().then(() =>
			console.log('now the leader')
		)
		const datumCollection = await db.collection({
			name: 'datums',
			schema: datum_schema,
		})
		const tag_collection = await db.collection({
			name: 'tags',
			schema: tag_schema,
		})
		const datum_collection_state = datumCollection.sync({
			remote: url + db_name + '/',
		})
		const tag_collection_state = tag_collection.sync({
			remote: url + db_name + '/',
		})
		this.subs.push(
			datum_collection_state.change$.subscribe(change => {
				console.log('datum collection change:')
				console.dir(change)
			})
		)
		this.subs.push(
			tag_collection_state.change$.subscribe(change => {
				console.log('tag collection change:')
				console.dir(change)
			})
		)
		this.subs.push(
			datum_collection_state.docs$.subscribe(docData =>
				console.dir(docData)
			)
		)
		this.subs.push(
			tag_collection_state.docs$.subscribe(docData =>
				console.log(docData)
			)
		)
		this.subs.push(
			datum_collection_state.active$.subscribe(active =>
				console.log(`datum collection syncing: ${active}`)
			)
		)
		this.subs.push(
			tag_collection_state.active$.subscribe(active =>
				console.log(`tag collection syncing: ${active}`)
			)
		)
		this.subs.push(
			datum_collection_state.complete$.subscribe(
				completed =>
					console.log(
						`datum collection synced: ${completed}`
					)
			)
		)
		this.subs.push(
			tag_collection_state.complete$.subscribe(completed =>
				console.log(`tag collection synced: ${completed}`)
			)
		)
		this.subs.push(
			datum_collection_state.error$.subscribe(error => {
				console.log('datum collection sync error:')
				console.dir(error)
			})
		)
		this.subs.push(
			tag_collection_state.error$.subscribe(e => {
				console.error('tag collection sync error:')
				console.error(e)
			})
		)
		return db
	}

	async handle_login(user, pass, db = {}) {
		console.log(`${user} logging in...`)
		const ajaxOpts = {
			ajax: {
				headers: {
					Authorization:
						'Basic ' + window.btoa(user + ':' + pass),
				},
			},
		}
		this.db = db ? db : new PouchDB(
			'https://db.getdatum.app/' + user,
			{
				fetch(url, opts) {
					opts.credentials = 'include'
					return PouchDB.fetch(url, opts)
				},
				auth: {
					username: user,
					password: pass,
				},
			}
		)
		await this.db.logIn(user, pass, ajaxOpts)
		await this.db.getSession()
		this.db = this.create_collections_and_sync(secret.db_url, user)
		let docs = await this.db.allDocs()
		this.setState({
			datums: docs.map(d => ({
				id: d.id,
				time: d.time,
				tags: d.tags,
			})),
		})
	}

	async handle_sign_up(user, pass) {
		const ajaxOpts = {
			ajax: {
				headers: {
					Authorization:
						'Basic ' + window.btoa(user + ':' + pass),
				},
			},
		}

		try {
			console.log(`${user} signing up...`)
			const db_url = secret.db_url + user
			// https://github.com/pouchdb-community/pouchdb-authentication/issues/239#issuecomment-403506880
			let db = new PouchDB(db_url, {
				fetch(url, opts) {
					opts.credentials = 'include'
					return PouchDB.fetch(url, opts)
				},
			})
      db = await db.signUp(user, pass, ajaxOpts)
      this.handle_login(user, pass, db)
			this.create_collections_and_sync(secret.db_url, user)
		} catch (e) {
			console.log(e)
		}
	}

	getEmptyDatum = () => ({
		id: null,
		time: null,
		tags: [],
	})

	async update_tag_metadata(datum) {
		datum.tags.map(t => { 
			let tag_already_exists
			let new_data = this.state.tags.map(
				(tag_metadata, i) => {
					if (tag_metadata.name === t.name) {
						tag_already_exists = true
						new_data = tag_metadata
						if (
							new_data.instance_times.includes(datum.time)
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

	async addDatum(e) {
		e.preventDefault()
		let { datums, active_datum, stashedDatum } = this.state
		if (!active_datum.tags.length) return
		if (active_datum.id) {
			// already exists?
			datums = datums.map(d =>
				d.id === active_datum.id ? active_datum : d
			)
			// tags = TODO update tag values and peers, look up by time loc in array
		} else {
			active_datum.id = uuid()
			active_datum.time = Date.now()
			datums = datums.concat(active_datum)
		}
		this.update_tag_metadata(active_datum)
		await this.db
			.upsert({
				id: active_datum.id,
				time: active_datum.time,
				tags: active_datum.tags,
			}, 'datums')
			.then(() =>
				console.log(`upserted ${active_datum.id}`)
			)

		// load empty or stashed datum in datum bar
		if (stashedDatum) {
			active_datum = stashedDatum
			stashedDatum = null
		} else {
			active_datum = this.getEmptyDatum()
		}

		this.setState({
			datums,
			stashedDatum,
			active_datum,
			datumBarInputValue: '',
			is_datum_bar_tag_menu_open: false,
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

	async deleteDatum(id) {
		this.setState(state => ({
			datums: state.datums.filter(datum => datum.id !== id),
		}))
		const datum_to_delete = await this.db.datums
			.findOne()
			.where('id')
			.eq(id)
			.exec()
		datum_to_delete.remove()
		console.log(`datum ${id} deleted`)
	}

	editDatum(id) {
		console.log(`editing datum ${id}`)
		this.setState(state => ({
			stashedDatum: state.active_datum,
			active_datum: state.datums.filter(
				d => d.id === id
			)[0], // escape array returned from filter
		}))
	}

	addTag(tag) {
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
			datumBarInputValue: '',
		}))
	}

	deleteTag(tag, index) {
		this.setState(state => ({
			active_datum: {
				...state.active_datum,
				tags: state.active_datum.tags.filter(
					(tag, i) => i !== index
				),
			},
		}))
	}

	updateDatumBarInput(e) {
		this.setState({
			datumBarInputValue: e.target.value,
		})
	}

	switch_view_to(view) {
		this.setState({
			current_view: view,
		})
	}

	render() {
		const views = {
			datum_list: (
				<DatumList
					datums={this.state.datums}
					onSelectEdit={this.editDatum}
					onSelectDelete={this.deleteDatum}
				/>
			),
			splash: (
				<Splash
					switch_view_to={this.switch_view_to}
					on_login={this.load_db}
				/>
			),
		}
		return (
			<MuiThemeProvider theme={theme}>
				<CssBaseline />

				{views[this.state.current_view]}

				<form onSubmit={this.addDatum}>
					<DatumBar
						value={this.state.active_datum.tags.map(
							tag => `${tag.name}:${tag.value}`
						)}
						onAddTag={this.addTag}
						onDeleteTag={this.deleteTag}
						is_tag_menu_open={
							this.state.is_datum_bar_tag_menu_open
						}
						on_focus={() =>
							this.setState({
								is_datum_bar_tag_menu_open: true,
							})
						}
						on_blur={() =>
							this.setState({
								is_datum_bar_tag_menu_open: false,
							})
						}
						InputProps={{
							onChange: this.updateDatumBarInput,
							value: this.state.datumBarInputValue,
						}}
					/>
				</form>

				<Fab
					onClick={this.addDatum}
					color='primary'
					size='small'
					style={styles.fab}
				>
					<AddIcon />
				</Fab>
			</MuiThemeProvider>
		)
	}
}

// TODO: on chip click/touch, pop up menu for tag values, with 'add value' option, then a modal?

export default App
