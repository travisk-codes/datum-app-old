import PouchDB from 'pouchdb'
import RxDB from 'rxdb'

import idb from 'pouchdb-adapter-idb'
import http from 'pouchdb-adapter-http'

RxDB.plugin(idb)
RxDB.plugin(http)

const cl = x => console.log(x)

const db_fetch = async ({ url, method, body }) => {
	try {
		const response = await fetch(url, {
			body,
			method,
			mode: 'cors',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				//'Authorization': 
			},
		})
		return response.json()
	} catch (e) { cl(e) }
}

export default class DB {
	constructor(url, schemas) {
		this.subs = []
		this.url = url
		this.schemas = schemas
		this.signup = this.signup.bind(this)
		this.login = this.login.bind(this)
		this.logout = this.logout.bind(this)
		this.get_all_docs = this.get_all_docs.bind(this)
		this.load = this.load.bind(this)
		this.upsert = this.upsert.bind(this)
		this.local_load = this.local_load.bind(this)
	}

	async signup(u, p) {
		return await db_fetch({
			url: `${this.url}/_users/org.couchdb.user:${u}`,
			method: 'put',
			body: `{"name": "${u}", "password": "${p}", "roles": [], "type": "user"}`,
		})
	}

	async login(u, p) {
		return await db_fetch({
			url: `${this.url}/_session`,
			method: 'post',
			body: `{"name": "${u}", "password": "${p}"}`,
		})
	}

	async logout() {
		return await db_fetch({
			url: `${this.url}/_session`,
			method: 'delete',
		})
	}

	async local_load(name) {
		try {
			this.db = await RxDB.create({
				name,
				adapter: 'idb',
				queryChangeDetection: true,
			})
		} catch (e) { cl(e) }
	}

	async load(u) {
		// create or load db
		const db = await RxDB.create({
			name: u,
			adapter: 'idb',
			queryChangeDetection: true,
			pouchSettings: {
				skip_setup: true,
			}
		})

		// get along with other open sessions e.g. dupe window
		db.waitForLeadership()
			.then(() => cl('now the leader!'))

		const datum_collection = await db.collection(this.schemas[0])
		const tag_collection = await db.collection(this.schemas[1])

		// create collection replication state
		const datum_rep_state = datum_collection.sync({
			remote: this.url + '/_users/org.couchdb.user:' + u,
			options: {
				fetch(url, opts) {
					PouchDB.fetch(url, {
						...opts,
						credentials: 'include',
					})
				},
				live: true,
				retry: false,
			}
		})
		this.subs.push(datum_rep_state.change$.subscribe(
			change => cl('change!: ' + change)
		))
		const tag_rep_state = tag_collection.sync({
			remote: this.url + '/_users/org.couchdb.user:' + u,
			options: {
				fetch(url, opts) {
					PouchDB.fetch(url, {
						...opts,
						credentials: 'include',
					})
				},
				live: true,
				retry: false,
			}
		})
		this.subs.push(tag_rep_state.change$.subscribe(
			change => cl('change!: ' + change)
		))


		// create or load collections from schemas
		/*const collections = await this.schemas.map(async ({ name, schema }) => {
			await db.collection({ name, schema })
		})

		// create collection replication states
		collections.forEach(collection => {
			const replication_state = collection.sync({
				remote: this.url + '_users/org.couchdb.user:' + this.user,
				options: {
					fetch(url, opts) {
						PouchDB.fetch(url, { ...opts, credentials: 'include' })
					},
					live: true,
					retry: true,
				}
			})
			this.subs.push(replication_state.change$.subscribe(
				change => cl('change!: ' + change)
			))
		})*/
		this.db = db
		//console.log(db)
	}

	async get_all_docs(cb) {
		this.schemas.forEach(schema => {
			const sub = this.db[schema.name]
				.find()
				.sort({ id: 1 })
				.$.subscribe(
					docs => {
						if (!docs.length) {
							console.log(`no ${schema.name}`)
						} else {
							cb(docs)
						}
					}
				)
			this.subs.push(sub)
		})
	}

	async get_all_datums() {
		try {
			let datum_docs = []
			const subscription = await this.db.datums
				.find()
				.sort({ time: 1 })
				.$.subscribe(docs => {
					cl('change! ' + docs)
					datum_docs.push(docs)
				})
			this.subs.push(subscription)
			return datum_docs.map(
				({ id, name, tags }) => ({ id, name, tags })
			)
		} catch (e) { cl(e) }
	}

	async upsert(doc, type) {
		const res = await this.db[type].insert(doc)
		return res
	}
}