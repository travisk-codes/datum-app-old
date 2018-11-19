import React, { Component, Fragment } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  AppBar,
  Button,

  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,

  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
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
            <ListItem divider key={item.id}>
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

        <Button style={{margin: 8}} variant='contained' color='primary'>
          Add Datum
        </Button>

      </Fragment>
    );
  }
}

export default App;
