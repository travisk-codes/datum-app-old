import React, { Component } from 'react'
import {
  AppBar,
  CssBaseline,
  Toolbar,
} from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import AddIcon from '@material-ui/icons/AddRounded'


import DatumBar from './DatumBar'
import DatumList from './DatumList'
import datums from './datums'
import logo from './datum-logo.svg'
/*
function get_color() {
  let rand_color
  fetch('http://www.colr.org/json/color/random')
    .then(res => res.json())
    .then(json => {
      console.log(`#${json.colors[0].hex}`)
      rand_color = '#' + json.colors[0].hex
    })
    .catch(e => {
      rand_color = '#555'
    })
  return rand_color
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
*/
function get_palette() {
  let my_palette = {
    palette: {
      primary: red,
      secondary: green,
    },
    typography: {
      useNextVariants: true, // removes a console error
    }
  }
  return my_palette
}


const theme = createMuiTheme(get_palette())

const styles = {
  fab: {
    position: 'fixed',
    right: 5,
    bottom: 5,
  }
}

const TopBar = () => (
  <AppBar position='fixed'>
    <Toolbar>
      <img
        src={logo}
        alt='logo'
        style={{
          height: 34,
        }}
      />
    </Toolbar>
  </AppBar>
)

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
          //{ name: 'water', value: 8 },
          //{ name: 'ayyy', value: 'bravo'},
        ]
      },
      datumBarInputValue: '',//'weight',
      is_datum_bar_tag_menu_open: false,
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
    
    // append new or replace edited datum in list
    if (activeDatum.id) { // i.e. already exists
      datums = datums.map(datum => (
        datum.id === activeDatum.id ? activeDatum : datum
      ))
    } else {
      activeDatum.id = datums.length + 1
      activeDatum.time = Date.now()
      datums = datums.concat(activeDatum)
    }
      
    // load empty or stashed datum in datum bar
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
      is_datum_bar_tag_menu_open: false,
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
        <TopBar />
        <DatumList
          datums={this.state.datums}
          onSelectEdit={this.editDatum}
          onSelectDelete={this.deleteDatum}
        />
        <form onSubmit={this.addDatum}>
          <DatumBar
            value={this.state.activeDatum.tags.map(tag => `${tag.name}:${tag.value}`)}
            onAddTag={this.addTag}
            onDeleteTag={this.deleteTag}
            is_tag_menu_open={this.state.is_datum_bar_tag_menu_open}
            on_focus={() => this.setState({is_datum_bar_tag_menu_open: true})}
            on_blur={() => this.setState({is_datum_bar_tag_menu_open: false})}
            InputProps={{
              onChange: this.updateDatumBarInput,
              value: this.state.datumBarInputValue,
            }}
          />
        </form>
        <Fab 
          onClick={this.addDatum}
          color='primary' 
          size='small' 
          style={styles.fab}
        >
          <AddIcon />
        </Fab>
      </MuiThemeProvider>
    );
  }
}

// TODO: on chip click/touch, pop up menu for tag values, with 'add value' option, then a modal?

export default App
