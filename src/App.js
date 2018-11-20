import React, { Component } from 'react'
import ChipInput from 'material-ui-chip-input'
import {
  AppBar,
  Chip,
  CssBaseline,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

const theme = createMuiTheme({
  palette: {
    primary: red,
  },
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
  }

  addDatum(e) {
    e.preventDefault()
    const emptyDatum = {
      id: null,
      time: null,
      tags: [],
    }
    this.setState(state => ({
      datums: state.datums.concat(state.activeDatum),
      activeDatum: emptyDatum,
    }))
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

  render() {
    const datums = this.state.datums.map(datum => (
      <ListItem divider>
        <ListItemText>
          {datum.tags.map(tag =>(
            <Chip 
              label={tag.name}
              style={{
                marginRight: 8,
              }}
            />
          ))}
        </ListItemText>
      </ListItem>
    ))
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar position='static'>
          <Toolbar>
            <Typography variant='title' color='inherit'>
              <span role='img' aria-label='Graph'>📊</span> Datum
            </Typography>
          </Toolbar>
        </AppBar>

        <List>{datums}</List>

        <form onSubmit={this.addDatum}>
          <ChipInput
            value={this.state.activeDatum.tags.map(tag => tag.name)}
            onAdd={this.addTag}
            style={{ 
              position: 'absolute',
              bottom: 8,
              left: 8,
              right: 8,
            }}
          />
        </form>
      </MuiThemeProvider>
    );
  }
}

// TODO: on chip click/touch, pop up menu for tag values, with 'add value' option, then a modal?

export default App;
