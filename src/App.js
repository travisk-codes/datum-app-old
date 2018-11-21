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

const theme = createMuiTheme({
  palette: {
    primary: red,
  },
  typography: {
    useNextVariants: true,
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
          <MenuItem onClick={this.handleClose}>Edit</MenuItem>
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
      activeDatum: {
        id: null,
        time: null,
        tags: [
          { name: 'one', value: null },
          { name: 'two', value: null },
        ],
      },
    }
    this.addDatum = this.addDatum.bind(this)
    this.addTag = this.addTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
  }

  addDatum(e) {
    e.preventDefault()
    if (!this.state.activeDatum.tags.length) return
    const newDatum = {
      id: Date.now(),
      time: null,
      tags: [],
    }
    this.setState(state => ({
      datums: state.datums.concat(state.activeDatum),
      activeDatum: newDatum,
    }))
  }

  deleteDatum(id) {
    console.log(`datum ${id} deleted`)
    this.setState(state => ({
      datums: state.datums.filter(datum => datum.id !== id)
    }))
  }

  editDatum(id) {
    // TODO
  }

  addTag(newTag) {
    this.setState(state => ({
      activeDatum: {
        ...state.activeDatum,
        tags: state.activeDatum.tags.concat({
          name: newTag,
          value: null,
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
            <Chip
              key={index}
              label={tag.name}
              style={{
                margin: 4,
                marginLeft: 0,
              }}
            />
          ))}
        </ListItemText>
        <ListItemSecondaryAction>
          <DatumMenu
            onSelectDelete={() => this.deleteDatum(datum.id)}
            onEdit={this.editDatum}
          />
        </ListItemSecondaryAction>
      </ListItem>
    ))
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' color='inherit'>
              <span role='img' aria-label='Graph'>📊</span> Datum
            </Typography>
          </Toolbar>
        </AppBar>

        <List dense>{datums}</List>

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
            )}
            style={{
              position: 'fixed',
              bottom: 8,
              left: 8,
              right: 8,
              paddingTop: 6,
              paddingLeft: 6,
              borderRadius: 24,
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

export default App;
