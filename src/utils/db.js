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

function load(app, user) {
	console.log(user)
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

export default { load, add, del }