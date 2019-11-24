import * as firebase from 'firebase/app'
import 'firebase/database'
import secret from './secret'

const config = secret || {
	apiKey: process.env.FB_API_KEY,
	authDomain: process.env.FB_AUTH_DOMAIN,
	databaseURL: process.env.FB_DATABASE_URL,
	projectId: process.env.FB_PROJECT_ID,
	storageBucket: process.env.FB_STORAGE_BUCKET,
	messagingSenderId: process.env.FB_MESSAGE_SENDER_ID,
	appId: process.env.FB_APP_ID,
}

const db = {
	load(app) {
		firebase
			.database()
			.ref('datums')
			.on('value', snapshot => {
				let datums_state = []

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
	},
	add(datum) {
		firebase
			.database()
			.ref('datums')
			.push(datum)
	},
	del(id) {
		firebase
			.database()
			.ref(`/datums/${id}`)
			.remove()
	},
}

export { db }
