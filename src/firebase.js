import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import secret from './utils/secret'

const config = secret || {
	apiKey: process.env.FB_API_KEY,
	authDomain: process.env.FB_AUTH_DOMAIN,
	databaseURL: process.env.FB_DATABASE_URL,
	projectId: process.env.FB_PROJECT_ID,
	storageBucket: process.env.FB_STORAGE_BUCKET,
	messagingSenderId: process.env.FB_MESSAGE_SENDER_ID,
	appId: process.env.FB_APP_ID,
}

firebase.initializeApp(config)
export default firebase
