import React, { Component, Fragment } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

import {
  AppBar,
  Chip,
  
  List,
  ListItem,
  ListItemText,
  
  Toolbar,
  Typography,
} from '@material-ui/core'
import ChipInput from 'material-ui-chip-input'

const theme = createMuiTheme({
  palette: {
    primary: red,
  },
})

// eslint-disable-next-line
let tags = [
  'coffee',
  'water',
  'exercise',
  'gas',
]

let tag_example = {
  name: 'mood',
  value: 5,
}

let datum_example = {
  id: 1,
  time: Date.now(),
  tags: [
    tag_example,
    { name: 'energy', value: 3 },
  ],
}

let another_datum = {
  id: 2,
  time: Date.now(),
  tags: [
    { name: 'pull ups', value: 20 },
    { name: 'bpm', value: 170 },
  ],
}

// eslint-disable-next-line
let datums = [
  datum_example,
  another_datum,
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
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      datums: [
        {
          id: 1,
          tags: ['yey', 'bravo'],
        },
        {
          id: 2,
          tags: ['eyyy?'],
        },
      ],
      chips: ['one', 'two'],
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.addChip = this.addChip.bind(this)
  }

  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState(state => (
      {
        datums: state.datums.concat({
          tags: state.chips
        }),
        chips: [],
      }
    ))
  }

  addChip(chip) {
    this.setState(state => ({
      chips: state.chips.concat(chip)
    }))
  }

  render() {
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

        <List>
          {this.state.datums.map(datum => (
            <ListItem divider>
              <ListItemText>
                {datum.tags.map(tag => (
                  <Chip 
                    label={tag} 
                    style={{
                      marginRight: 8,
                    }}
                  />
                ))}
              </ListItemText>
            </ListItem>
          ))}
        </List>

        <form onSubmit={this.handleSubmit}>
          <ChipInput
            value={this.state.chips}
            onAdd={this.addChip}
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
