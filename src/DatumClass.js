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

	getValue(tag_name) {
		let value
		this.tags.forEach(t => {
			if (t.name === tag_name) value = t.value
		})
		return value
	}

	hasTag(tag) {
		let hasTag = false
		this.tags.forEach(t => {
			if (t.name === tag) hasTag = true
		})
		return hasTag
	}

	addTag(name, value = '') { 
		console.log(this.tags)
		this.tags.push({ name, value })
		console.log(this.tags)
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
		this.tags = this.tags.filter(t => t.name !== name)
	}

}
