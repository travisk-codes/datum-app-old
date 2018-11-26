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
import DatumList from './DatumList'
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
      datumBarInputValue: '',
    }
    this.addDatum = this.addDatum.bind(this)
    this.deleteDatum = this.deleteDatum.bind(this)
    this.editDatum = this.editDatum.bind(this)
    this.addTag = this.addTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.updateDatumBarInput = this.updateDatumBarInput.bind(this)
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
      datumBarInputValue: '',
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
      },
      datumBarInputValue: '',
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

  updateDatumBarInput(e) {
    this.setState({
      datumBarInputValue: e.target.value,
    })
  }

  render() {
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

        <DatumList datums={this.state.datums} />

        <form onSubmit={this.addDatum}>
          <DatumBar
            value={this.state.activeDatum.tags.map(tag => `${tag.name}:${tag.value}`)}
            onAddTag={this.addTag}
            onDeleteTag={this.deleteTag}
            InputProps={{
              onChange: this.updateDatumBarInput,
              value: this.state.datumBarInputValue,
            }}
            style={{
              backgroundColor: 'whitesmoke',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              paddingTop: 10,
              paddingBottom: 4,
              paddingLeft: 6,
              boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2',
            }}
          />
        </form>
      </MuiThemeProvider>
    );
  }
}

// TODO: on chip click/touch, pop up menu for tag values, with 'add value' option, then a modal?

export default App
