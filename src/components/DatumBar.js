import React, { Component } from 'react'
import ChipInput from 'material-ui-chip-input'
import { Fab } from '@material-ui/core'

import { rand_color, objectify } from '../utils/getTagColor'
import { withStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/AddRounded'
import MenuIcon from '@material-ui/icons/AmpStoriesRounded'
import Tag from './Tag'

const styles = {
	container: {
		display: 'flex',
		position: 'fixed',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		left: 0,
		right: 0,
		bottom: 0,
	},
	dimmed_background: {
		// display: controlled
		position: 'fixed',
		width: '100%',
		height: '100%',

		backgroundColor: 'black',
		opacity: 0.15,
	},
	tag_menu: {
		// display: controlled
		position: 'relative',
		flexWrap: 'wrap-reverse',
		justifyContent: 'center',
		padding: 8,
		margin: 8,
		left: 0,
		right: 0,

		backgroundColor: 'whitesmoke',
		boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2)',
		borderRadius: 8,
	},
	tag_menu_tag: {
		display: 'inline-flex',
		position: 'relative',
		flex: '1 1 auto',
		margin: 2,
	},
	datum_bar: {
		display: 'inline-flex',
		position: 'relative',
		padding: 6,
		left: 0,
		right: 0,
		bottom: 0,

		backgroundColor: 'whitesmoke',
		boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2)',
	},
	datum_bar_input: {
		display: 'inline-flex',
		position: 'relative',
		flex: 'unset',
		paddingLeft: 12,
		paddingTop: 2,
		paddingRight: 12,
		margin: 3,
		marginLeft: 3,
		marginBottom: 3,
		height: 32,

		border: '1px solid lightgrey',
		borderRadius: 16,
		fontSize: '0.8125rem',
		borderTopLeftRadius: 16,
		borderBottomLeftRadius: 16,
	},
	value_input: {
		display: 'inline-flex',
		position: 'relative',
		flex: 'unset',
		paddingLeft: 6,
		paddingTop: 2,
		paddingRight: 12,
		margin: 3,
		marginLeft: 0,
		marginBottom: 5, // shrug
		height: 32,

		border: '1px solid lightgrey',
		borderRadius: 16,
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0,
		fontSize: '0.8125rem',
	},
	hidden_span: {
		// used to calculate datum bar input width
		display: 'inline',
		position: 'absolute',
		padding: '0 13px',
		left: 0,
		bottom: 0,

		fontSize: '0.8125rem',
	},
	fab: {
		position: 'fixed',
		right: 5,
		bottom: 5,
	},
	side_menu: {
		width: 250,
	}, // TODO move
}

const TagBar = props => {
	let matches = []
	try {
		if (props.mode === 'tag_name')
			matches = props.tag_names.filter(
				n => n.indexOf(props.filter) >= 0
			)
		if (props.mode === 'tag_value')
			matches = props
				.get_tag_values_for(props.active_tag)
				.filter(v => v.indexOf(props.filter) >= 0)
	} catch (e) {
		console.error(e)
		matches = []
	}
	let tags = matches.map(t => {
		let name = false, value = false
		if (props.mode === 'tag_name') name = t
		if (props.mode === 'tag_value') value = t
		return (
			<Tag
				key={t}
				name={name}
				value={value}
				style={{
					...styles.tag_menu_tag,
					flexGrow:
						props.mode === 'tag_name'
							? props.getTagCountFor(name) * 10
							: 1,
				}}
				onClick={() => props.onClick(t)}
				color={
					// if no color, color is active tag's
					props.tag_colors[t] ||
					props.tag_colors[props.active_tag]
				}
			/>
		)
	})

	return (
		<div
			style={{
				...styles.tag_menu,
				display:
					props.is_open && matches.length ? 'flex' : 'none',
			}}
		>
			{tags}
		</div>
	)
}

class DatumBar extends Component {
	constructor(props) {
		super(props)
		this.MIN_INPUT_WIDTH = 32
		this.hidden_span = React.createRef()

		this.state = {
			tags: [],
			input: '',
			mode: 'tag_name' || 'tag_value',
			menu_is_open: false,
			active_tag: null,
			active_datum_id: null,
			//active_value: null,
			input_width: undefined,
			is_side_menu_open: false,
		}

		this.update_input = this.update_input.bind(this)
		this.on_submit_datum = this.on_submit_datum.bind(this)
		this.add_tag = this.add_tag.bind(this)
		this.del_tag = this.del_tag.bind(this)
		this.on_click_btn = this.on_click_btn.bind(this)
	}

	componentDidMount() {
		const input_width = Math.max(
			this.hidden_span.current.offsetWidth,
			this.MIN_INPUT_WIDTH
		)
		this.setState({ input_width })
	}

	componentDidUpdate() {
		const input_width = Math.max(
			this.hidden_span.current.offsetWidth,
			this.MIN_INPUT_WIDTH
		)
		// active datum just loaded?
		if (
			!this.state.active_datum_id &&
			this.props.active_datum.id
		) {
			this.setState({
				active_datum_id: this.props.active_datum.id,
				tags: this.props.active_datum.tags,
			})
		}
		// active datum just cleared?
		if (
			this.state.active_datum_id &&
			!this.props.active_datum.id
		) {
			this.setState({
				active_datum_id: null,
				tags: [],
			})
		}

		if (this.state.input_width !== input_width) {
			this.setState({ input_width })
		}
	}

	add_tag(tag) {
		let tagName,
			tagValue,
			mode,
			submitting_tag_value
		const values = this.props.get_tag_values_for(tag)
		const split = tag.indexOf(':')
		if (split > 0) {
			tagName = tag.substring(0, split)
			tagValue = tag.substring(split + 1)
			mode = 'tag_name'
		} else if (values && values[0]) {
			tagName = tag
			tagValue = ''
			mode = 'tag_value'
		} else {
			tagName = tag
			tagValue = ''
			mode = 'tag_name'
		}
		if (this.state.mode === 'tag_value') {
			tagName = this.state.active_tag
			tagValue = tag
			submitting_tag_value = true
			mode = 'tag_name'
		}
		this.setState(state => {
			let tags = state.tags
			if (submitting_tag_value) {
				tags.pop() // throw away valueless tag
				mode = 'tag_name'
			}

			return {
				tags: tags.concat(tagName + ':' + tagValue),
				input: '',
				mode,
				active_tag: mode === 'tag_value' ? tagName : null,
			}
		})
	}

	del_tag = (tag, index) =>
		this.setState({
			tags: this.state.tags.filter((tag, i) => i !== index),
		})

	on_submit_datum(e) {
		e.preventDefault()
		let state = {},
			menu_is_open
		if (e.key === 'Enter' && this.state.input === '')
			state.menu_is_open = false
		if (e.key !== 'Enter' && this.state.input === '')
			state.menu_is_open = true
		this.props.on_add_datum(
			this.state.tags.map(t => objectify(t))
		)
		this.setState({
			menu_is_open,
			tags: [],
			active_datum_id: null,
		})
	}

	on_click_btn(e) {
		e.preventDefault()
		if (!this.state.tags.length && !this.state.input) {
			this.props.on_button_long_press(e)
		} else {
			this.on_submit_datum(e)
		}
	}

	update_input = e =>
		this.setState({
			input: e.target.value,
		})

	handle_input_submit(e) {
		let { mode, active_tag } = this.state
		if (mode === 'tag_name')
			this.props.on_add_tag(e.target.value)
		if (mode === 'tag_value')
			this.props.on_add_tag(
				active_tag + ':' + e.target.value
			)
	}

	render() {
		const render_chip = (
			{ isFocused, handleClick, text },
			key
		) => {
			const { name, value } = objectify(text)
			let whole = false,
				half = false
			if (!this.props.tag_colors[name]) {
				this.props.tag_colors[name] = rand_color() // TODO fix color change on submit bug
				whole = true
			}
			if (
				this.props.get_tag_values_for(
					this.state.active_tag
				) &&
				this.state.active_tag === name
				// TODO fix disappearing tag values when dupes
			) {
				half = true
				whole = false
			} else {
				whole = true
			}
			if (name && value) {
				whole = false
				half = false
			}
			return (
				<Tag
					half={half}
					whole={whole}
					onClick={handleClick}
					name={name}
					value={value}
					key={key}
					color={this.props.tag_colors[name]}
				/>
			)
		}
		const is_background_dimmed = this.state.menu_is_open
			? 'flex'
			: 'none'
		const input_style =
			this.state.mode === 'tag_name'
				? styles.datum_bar_input
				: styles.value_input
		const btn_icon =
			!this.state.tags.length && !this.state.input ? (
				<MenuIcon />
			) : (
				<AddIcon />
			)
		let tag_names = this.props
			.getTagNames()
			.sort((a, b) => {
				if (
					this.props.getTagLastAddedFor(a) <
					this.props.getTagLastAddedFor(b)
				)
					return 1
				if (
					this.props.getTagLastAddedFor(a) >
					this.props.getTagLastAddedFor(b)
				)
					return -1
				return 0
			})
		return (
			<>
				<div
					id='datum-bar'
					style={styles.container}
					onFocus={() =>
						this.setState({
							menu_is_open: true,
						})
					}
				>
					{/* use this span to calculate width of datum bar input*/}
					<span
						ref={this.hidden_span}
						style={{
							...styles.hidden_span,
							paddingRight:
								this.state.mode === 'tag_value' ? 7 : 13,
						}}
					>
						{this.state.input}
					</span>

					{/* full screen dim when menu is open */}
					<div
						onClick={() =>
							this.setState({
								menu_is_open: false,
							})
						}
						style={{
							...styles.dimmed_background,
							display: is_background_dimmed,
						}}
					/>

					<TagBar
						is_open={this.state.menu_is_open}
						filter={this.state.input}
						onClick={this.add_tag}
						tag_colors={this.props.tag_colors}
						tag_names={tag_names}
						active_tag={this.state.active_tag}
						get_tag_values_for={
							this.props.get_tag_values_for
						}
						get_tag_count_for={this.props.get_tag_count_for}
						mode={this.state.mode}
						sorted_tags={this.props.sorted_tags}
						getTagCountFor={this.props.getTagCountFor}
					/>

					<form onSubmit={this.on_submit_datum}>
						<ChipInput
							value={
								this.props.active_tags || this.state.tags
							}
							onAdd={this.add_tag}
							onDelete={this.del_tag}
							chipRenderer={render_chip}
							placeholder='new tag'
							disableUnderline
							fullWidth
							style={styles.datum_bar}
							InputProps={{
								//autoFocus: true,
								onChange: this.update_input,
								value: this.state.input,
								//onKeyPress: this.on_submit_datum,
								style: {
									...input_style,
									width:
										!this.state.input &&
										!this.state.tags.length
											? 72
											: this.state.input_width,
								},
							}}
						/>
					</form>
				</div>
				<Fab
					onClick={this.on_click_btn}
					onContextMenu={this.props.on_button_long_press} // capture long press & right click
					onDoubleClick={this.props.on_button_long_press}
					style={styles.fab}
					color='primary'
					size='small'
				>
					{btn_icon}
				</Fab>
			</>
		)
	}
}

export default withStyles(styles)(DatumBar)
