import React, { Component } from 'react'
import * as RxDB from 'rxdb'
import uuid from 'uuid/v4'
//import { QueryChangeDetector } from 'rxdb'
import { datum_schema } from './schema'
import secret from './secret'

import {
  AppBar,
  CssBaseline,
  Toolbar,
  Fab,
} from '@material-ui/core'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import AddIcon from '@material-ui/icons/AddRounded'

import DatumBar from './DatumBar'
import DatumList from './DatumList'
import Splash from './Splash'
//import datums from './datums'
import logo from './datum-logo.svg'

//QueryChangeDetector.enable()
//QueryChangeDetector.enableDebugging()
RxDB.plugin(require('pouchdb-adapter-idb'))
RxDB.plugin(require('pouchdb-adapter-http'))
RxDB.plugin(require('pouchdb-authentication'))

const sync_url = secret.db_url
const db_name = 'datums'

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
      datums: [],
      stashedDatum: null,
      active_datum: {
        id: null,
        time: null,
        tags: [],
      },
      datumBarInputValue: '',
      is_datum_bar_tag_menu_open: false,
      current_view: 'datum_list',
    }
    this.subs = []
    this.addDatum = this.addDatum.bind(this)
    this.deleteDatum = this.deleteDatum.bind(this)
    this.editDatum = this.editDatum.bind(this)
    this.addTag = this.addTag.bind(this)
    this.deleteTag = this.deleteTag.bind(this)
    this.updateDatumBarInput = this.updateDatumBarInput.bind(this)
    this.create_db = this.create_db.bind(this)
    this.switch_view_to_app = this.switch_view_to_app.bind(this)
  }

  async componentDidMount() {
    this.db = await this.create_db()
    const sub = this.db.datums
      .find()
      .sort({time: 1})
      .$.subscribe(docs => {
        if (!docs) return
        this.setState({ datums: docs.map(d => (
          {
            id: d.id,
            time: d.time,
            tags: d.tags,
          }
        ))})
      })
    this.subs.push(sub)
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  async create_db() {
    const db = await RxDB.create({
      name: db_name,
      adapter: 'idb',
      password: secret.db_password,
      queryChangeDetection: true,
    })
    db.waitForLeadership().then(() => console.log('now the leader'))
    const datumCollection = await db.collection({
      name: 'datums',
      schema: datum_schema,
    })
    const replication_state = datumCollection.sync({ remote: sync_url + db_name + '/' })
    this.subs.push(
      replication_state.change$.subscribe(change => {
        console.log('Replication change:')
        console.dir(change)
      })
    )
    this.subs.push(
     replication_state.docs$.subscribe(docData => console.dir(docData))
    )
    this.subs.push(
      replication_state.active$.subscribe(active => console.log(`Replication active: ${active}`))
    )
    this.subs.push(
      replication_state.complete$.subscribe(completed => console.log(`Replication completed: ${completed}`))
    )
    this.subs.push(
      replication_state.error$.subscribe(error => {
        console.log('Replication Error:')
        console.dir(error)
      })
    )
    return db
  }

  getEmptyDatum = () => ({
    id: null,
    time: null,
    tags: [],
  })

  async addDatum(e) {
    e.preventDefault()
    let { datums, active_datum, stashedDatum } = this.state
    if (!active_datum.tags.length) return
    console.log(active_datum)
    // append new or replace edited datum in list
    if (active_datum.id) { // if datum exists
      datums = datums
        .map(d => d.id === active_datum.id ? active_datum : d)
    } else {
      active_datum.id = uuid()
      active_datum.time = Date.now()
      datums = datums.concat(active_datum)
    }
    console.log(active_datum.id)
    await this.db.datums.atomicUpsert({
      id: active_datum.id, 
      time: active_datum.time, 
      tags: active_datum.tags,
    }).then(() => console.log(`upserted ${active_datum.id}`))
      
    // load empty or stashed datum in datum bar
    if (stashedDatum) {
      active_datum = stashedDatum
      stashedDatum = null
    } else {
      active_datum = this.getEmptyDatum()
    }

    this.setState({
      datums,
      stashedDatum,
      active_datum,
      datumBarInputValue: '',
      is_datum_bar_tag_menu_open: false,
      current_view: 'datum_list',
    })

    // scroll to new datum at end of list
    window.setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' })
    }, 100) // give state some time to update before scroll, janky solution :/
  }

  async deleteDatum(id) {
    this.setState(state => ({
      datums: state.datums.filter(datum => datum.id !== id)
    }))
    const datum_to_delete = await this.db.datums
      .findOne()
      .where('id')
      .eq(id)
      .exec()
    datum_to_delete.remove()
    console.log(`datum ${id} deleted`)
  }

  editDatum(id) {
    console.log(`editing datum ${id}`)
    this.setState(state => ({
      stashedDatum: state.active_datum,
      active_datum: state.datums.filter(d => d.id === id)[0] // escape array returned from filter
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
      tagValue = ''
    }
    this.setState(state => ({
      active_datum: {
        ...state.active_datum,
        tags: state.active_datum.tags.concat({
          name: tagName,
          value: tagValue,
        }),
      },
      datumBarInputValue: '',
    }))
  }

  deleteTag(tag, index) {
    this.setState(state => ({
      active_datum: {
        ...state.active_datum,
        tags: state.active_datum.tags.filter((tag, i) => (
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

  switch_view_to_app(e) {
    e.preventDefault()
    this.setState({
      current_view: 'datum_list'
    })
  }

  render() {
    const views = {
      'datum_list': (
        <DatumList
          datums={this.state.datums}
          onSelectEdit={this.editDatum}
          onSelectDelete={this.deleteDatum}
        />
      ),
      'splash': (
        <Splash switch_view_to_app={this.switch_view_to_app}/>
      ),
    }
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar />
        {views[this.state.current_view]}
        <form onSubmit={this.addDatum}>
          <DatumBar
            value={this.state.active_datum.tags.map(tag => `${tag.name}:${tag.value}`)}
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
