import React, { Component, Fragment } from 'react'
import ChipInput from 'material-ui-chip-input'
import {
  AppBar,
  CssBaseline,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  IconButton,
} from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import MoreIcon from '@material-ui/icons/MoreVert'
import red from '@material-ui/core/colors/red'

import Tag from './Tag'
import DatumBar from './DatumBar'
import AutoSuggest from './AutoSuggest'
import datums from './datums'
import logo from './datum-logo.svg'

const theme = createMuiTheme({
  palette: {
    primary: red,
  },
  typography: {
    useNextVariants: true, // removes a console error
  }
})

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
          aria-owns={anchorEl ? 'list-datum-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreIcon />
        </IconButton>
        <Menu
          id="list-datum-menu"
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
      datums,
      stashedDatum: null,
      activeDatum: {
        id: null,
        time: null,
        tags: [
          { name: 'water', value: 8 },
          { name: 'ayyy', value: 'bravo'},
        ]
      },
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
    let { datums, activeDatum, stashedDatum } = this.state
    if (!activeDatum.tags.length) return
    
    // append new or replace edited datum
    if (activeDatum.id) { // i.e. already exists
      datums = datums.map(datum => (
        datum.id === activeDatum.id ? activeDatum : datum
      ))
    } else {
      activeDatum.id = datums.length + 1
      activeDatum.time = Date.now()
      datums = datums.concat(activeDatum)
    }
      
    // load empty or stashed datum
    if (stashedDatum) {
      activeDatum = stashedDatum
      stashedDatum = null
    } else {
      activeDatum = this.getEmptyDatum()
    }

    this.setState({
      datums,
      stashedDatum,
      activeDatum,
    })

    // scroll to new datum at end of list
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

  addTag(tag) {
    let tagName, tagValue
    const split = tag.indexOf(':')
    if (split > 0) {
      tagName = tag.substring(0, split)
      tagValue = tag.substring(split + 1)
    } else {
      tagName = tag
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
    const TagSpacer = () => (<div style={{ display: 'inline-block', width: 6 }} />)
    const datums = this.state.datums.map(datum => (
      <ListItem divider key={datum.id}>
        <ListItemText>
          {datum.tags.map((tag, index) => (
            <Fragment key={index}>
              <Tag
                name={tag.name}
                value={tag.value}
              />
              <TagSpacer />
            </Fragment>
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
            <img 
              src={logo} 
              alt='logo' 
              style={{
                marginTop: 4,
                height: 40,
              }}
            />
          </Toolbar>
        </AppBar>

        <List style={{
          marginTop: 64, // TODO: set dynamically to app bar height
          marginBottom: 38, // for datum bar
        }}>
          {datums}
        </List>

        <DatumBar 
          value={this.state.activeDatum.tags.map(tag => `${tag.name}:${tag.value}`)}
          onAddTag={this.addTag}
          onDeleteTag={this.deleteTag}
          style={{
            paddingTop: 10,
            paddingBottom: 4,
            paddingLeft: 6,
            boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2',
          }}
        />

        <AutoSuggest />

        <form onSubmit={this.addDatum}>
          <ChipInput
            value={this.state.activeDatum.tags.map(tag => `${tag.name}:${tag.value}`)}
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
              <Fragment key={key}>
                <Tag
                  onClick={handleClick}
                  nameValueString={value}
                  isActiveDatumTag
                />
                <TagSpacer />
              </Fragment>
            )}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              paddingTop: 10,
              paddingBottom: 4,
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
