export default class Datum {

	constructor(id = null, time = null, tags = []) {
		this.id = id
		this.time = time
		this.tags = tags
	}

	getId() {
		return this.id
	}

	setId(id) {
		this.id = id
	}

	getTime() {
		return this.time
	}

	setTime(time) {
		this.time = time
	}

	getTags() {
		return this.tags
	}

	setTags(tags) {
		this.tags = tags
	}

	hasTag(tag) {
		let hasTag = false
		this.tags.forEach(t => {
			if (t.name === tag) hasTag = true
		})
		return hasTag
	}

	addTag(name, value = '') { 
		this.tags.concat({ name, value })
	}
	
	addStringPair(pair) {
		const split = pair.indexOf(':')
		const name = pair.substring(0, split)
		const value = pair.substring(split + 1)
		this.tags.concat({ name, value })
	}

	addTagObject(tag) {
		this.tags.concat(tag)
	}

	removeTag(name) {
		this.tags.filter(t => t.name !== name)
	}

}
