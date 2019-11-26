import * as firebase from 'firebase/app'
import 'firebase/auth'

let currentUID
let listeningFirebaseRefs

export function onAuthStateChanged(user) {
	// We ignore token refresh events.
	if (user && currentUID === user.uid) {
		return
	}
	listeningFirebaseRefs.forEach(function(ref) {
		ref.off()
	})
	listeningFirebaseRefs = []
	if (user) {
		currentUID = user.uid

		firebase
			.database()
			.ref('/users/' + user.uid)
			.set({
				username: user.displayName,
				email: user.email,
				profile_picture: user.photoURL,
			})
		const myUserId = firebase.auth().currentUser.uid
		const datums_ref = firebase.database().ref('datums')
		const user_datums_ref = firebase
			.database()
			.ref('/user-datums/' + myUserId)

		const fetchPosts = function(datums_ref) {
			datums_ref.on('child_added', function(data) {
				var author = data.val().author || 'Anonymous'
			})
			datums_ref.on('child_changed', function(data) {})
			datums_ref.on('child_removed', function(data) {})
		}

		// Fetching and displaying all posts of each sections.
		/*fetchPosts(topUserPostsRef, topUserPostsSection)
		fetchPosts(recentPostsRef, recentPostsSection)
		fetchPosts(userPostsRef, userPostsSection)

		// Keep track of all Firebase refs we are listening to.
		listeningFirebaseRefs.push(topUserPostsRef)
		listeningFirebaseRefs.push(recentPostsRef)
		listeningFirebaseRefs.push(userPostsRef)*/
	} else {
		// Set currentUID to null.
		currentUID = null
	}
}

export function currentUserAddDatum(datum) {
	const user_id = firebase.auth().currentUser.uid
	return firebase
		.database()
		.ref('/users/' + user_id)
		.once('value')
		.then(snapshot => {
			const username =
				(snapshot.val() && snapshot.val().username) ||
				'Anonymous'
			let updates
			let new_datum_key = firebase
				.database()
				.ref()
				.child('datums')
				.push().key
			updates['/datums/' + new_datum_key] = datum
			updates[
				`/user-datums/${user_id}/${new_datum_key}`
			] = datum
			return firebase.database.ref().update(updates)
		})
}

export function signIn() {
	const provider = new firebase.auth.GoogleAuthProvider()
	firebase.auth().signInWithPopup(provider)
}
export function signOut() {
	firebase.auth().signOut()
}
