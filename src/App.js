import React, { Component, Fragment } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  AppBar,
  Button,
  Checkbox,
  Chip,

  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,

  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core'
import ChipInput from 'material-ui-chip-input'

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
      items: [
        {
          text: 'ayy'
        },
        {
          text: 'bravo'
        },
      ],
      text: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    this.setState({ text: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    if (!this.state.text.length) { return }

    const newItem = {
      text: this.state.text,
      id: Date.now(),
    }

    this.setState(state => (
      {
        items: state.items.concat(newItem),
        text: '',
      }
    ))
  }

  render() {
    return (
      <Fragment>
        <CssBaseline />

        <AppBar position='static'>
          <Toolbar>
            <Typography variant='title' color='inherit'>
              Datum
            </Typography>
          </Toolbar>
        </AppBar>

        <List>
          {this.state.items.map(item => (
            <ListItem disableRipple button divider key={item.id}>
              <Checkbox />
              <Button>ayy</Button>
              <ListItemText>
                {item.text}
              </ListItemText>
            </ListItem>
          ))}
        </List>

        <form onSubmit={this.handleSubmit} autoComplete='off'>
          <TextField
            id='new-todo'
            label='New Datum'
            value={this.state.text}
            onChange={this.handleChange}
            margin='dense'
            variant='outlined'
            style={{ margin: 8 }}
          />
        </form>
        
        <ChipInput
          defaultValue={['Yey', 'Bravo']}
          style={{ margin: 8 }}
        />
      </Fragment>
    );
  }
}

export default App;
