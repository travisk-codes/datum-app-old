import React, { Component } from 'react'
import ChipInput from 'material-ui-chip-input'
import {
  AppBar,
  Chip,
  CssBaseline,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import MoreIcon from '@material-ui/icons/MoreVert'
import red from '@material-ui/core/colors/red'

import Tag from './Tag'

const theme = createMuiTheme({
  palette: {
    primary: red,
  },
  typography: {
    useNextVariants: true, // removes a console error
  }
})

// eslint-disable-next-line
let tags = [
  'anxiety',
  'bpm',
  'calories',
  'coffee',
  'distance',
  'exercise',
  'finances',
  'gas',
  'knee push ups',
  'mental energy',
  'milage',
  'mood',
  'pace',
  'physical energy',
  'pull ups',
  'push ups',
  'sleep',
  'todo',
  'water',
  'weight',
  'wide arm push ups',
]

let datums = [
  {
    id: 1,
    time: Date.now(),
    tags: [
      { name: 'mood', value: 5 },
      { name: 'energy', value: 3 },
    ],
  },
  {
    id: 2,
    time: Date.now(),
    tags: [
      { name: 'pull ups', value: 20 },
      { name: 'bpm', value: 170 },
    ],
  },
  {
    id: 3,
    time: Date.now(),
    tags: [
      { name: 'mood', value: 4 },
      { name: 'coffee', value: null },
    ],
  },
  {
    id: 4,
    time: Date.now(),
    tags: [
      { name: 'weight', value: 150 },
    ],
  },
  {
    id: 5,
    time: Date.now(),
    tags: [
      { name: 'water', value: null },
    ]
  },
]

class DatumMenu extends Component {
  state = {
    anchorEl: null,
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleDelete = () => {
    this.props.onSelectDelete()
    this.handleClose()
  }

  handleEdit = () => {
    this.props.onSelectEdit()
    this.handleClose()
  }

  render() {
    const { anchorEl } = this.state

    return (
      <div>
        <IconButton
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleEdit}>Edit</MenuItem>
          <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
        </Menu>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datums: datums,
      activeDatum: this.getEmptyDatum(),
      stashedDatum: null,
    }
    this.addDatum = this.addDatum.bind(this)
    this.deleteDatum = this.deleteDatum.bind(this)
    this.editDatum = this.editDatum.bind(this)
    this.addTag = this.addTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
  }

  getEmptyDatum = () => ({
    id: null,
    time: null,
    tags: [],
  })

  addDatum(e) {
    e.preventDefault()
    if (!this.state.activeDatum.tags.length) return

    let activeDatumAfterAdd
    let { datums, activeDatum, stashedDatum } = this.state

    if (this.state.stashedDatum) {
      activeDatumAfterAdd = stashedDatum
      stashedDatum = null
    } else {
      activeDatumAfterAdd = this.getEmptyDatum()
    }

    if (activeDatum.id) { // i.e. already exists
      datums = datums.map(datum => (
        datum.id === activeDatum.id ? activeDatum : datum
      ))
    } else {
      activeDatum.id = datums.length + 1
      activeDatum.time = Date.now()
      datums = datums.concat(activeDatum)
    }
    this.setState({
      datums,
      activeDatum: activeDatumAfterAdd,
      stashedDatum,
    })
    window.setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' })
    }, 100) // give state some time to update before scroll, janky solution :/
  }

  deleteDatum(id) {
    console.log(`datum ${id} deleted`)
    this.setState(state => ({
      datums: state.datums.filter(datum => datum.id !== id)
    }))
  }

  editDatum(id) {
    console.log(`editing datum ${id}`)
    this.setState(state => ({
      stashedDatum: state.activeDatum,
      activeDatum: state.datums.filter(datum => datum.id === id)[0] // escape array returned from filter
    }))
  }

  addTag(newTag) {
    let tagName, tagValue
    const split = newTag.indexOf(':')
    if (split >= 0) {
      tagName = newTag.substring(0, split)
      tagValue = newTag.substring(split + 1)
    } else {
      tagName = newTag
      tagValue = null
    }
    this.setState(state => ({
      activeDatum: {
        ...state.activeDatum,
        tags: state.activeDatum.tags.concat({
          name: tagName,
          value: tagValue,
        }),
      }
    }))
  }

  deleteTag(tag, index) {
    this.setState(state => ({
      activeDatum: {
        ...state.activeDatum,
        tags: state.activeDatum.tags.filter((tag, i) => (
          i !== index
        ))
      }
    }))
  }

  render() {
    const datums = this.state.datums.map(datum => (
      <ListItem divider key={datum.id}>
        <ListItemText>
          {datum.tags.map((tag, index) => (
            <Tag
              key={index}
              name={tag.name}
              value={tag.value}
              style={{
                margin: 4,
                marginLeft: 0,
              }}
            />
            /*<Chip
              key={index}
              label={tag.name}
              style={{
                margin: 4,
                marginLeft: 0,
              }}
            />*/
          ))}
        </ListItemText>
        <ListItemSecondaryAction>
          <DatumMenu
            onSelectDelete={() => this.deleteDatum(datum.id)}
            onSelectEdit={() => this.editDatum(datum.id)}
          />
        </ListItemSecondaryAction>
      </ListItem>
    ))
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position='fixed'>
          <Toolbar>
            <Typography variant='h6' color='inherit'>
              <span role='img' aria-label='Graph'>📊</span> Datum
            </Typography>
          </Toolbar>
        </AppBar>

        <List 
          dense
          style={{
            marginTop: 64, // TODO: set dynamically to app bar height
            marginBottom: 38, // for datum bar
          }}
        >
          {datums}
        </List>

        <form onSubmit={this.addDatum}>
          <ChipInput
            value={this.state.activeDatum.tags.map(tag => tag.name)}
            onAdd={this.addTag}
            onDelete={this.deleteTag}
            disableUnderline
            chipRenderer={(
              {
                isFocused,
                handleClick,
                value,
              }, 
              key
            ) => (
              <Chip
                key={key}
                label={value}
                onClick={handleClick}
                style={{
                  backgroundColor: isFocused ? 'lightgrey' : null,
                  marginTop: -24,
                  marginRight: 4,
                }}
              />
              /*<Tag
                key={key}
                name={tag.name}
                value={tag.value ? tag.value : null}
                onClick={handleClick}
                style={{
                  backgroundColor: isFocused ? 'lightgrey' : null,
                  marginTop: -24,
                  marginRight: 4,
                }}
              />*/
            )}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              paddingTop: 6,
              paddingLeft: 6,

              backgroundColor: '#fafafa',
              boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2)',
            }}
          />
        </form>
      </MuiThemeProvider>
    );
  }
}

// TODO: on chip click/touch, pop up menu for tag values, with 'add value' option, then a modal?

export default App
