import React, { Component } from 'react'

// material UI
import AutoComplete from 'material-ui/AutoComplete'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import ActionFavorite from 'material-ui/svg-icons/action/favorite'
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border'

// material UI - dropdown menu
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

// firebase
import firebase from 'app/fire'

// react components
import AllStoryBranches from './AllStoryBranches'
import {onlyPublished} from '../utils/storyBranchNavUtils'

const styles = {
  customWidth: {
    width: 200,
  },
}

export default class Searchbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // stores objects from call to firebase
      allStoryBranches: {},
      // stores titles to search on
      titles: [],
      // our query
      query: '',
      postive: true,
      tags: [],
      // default val for drop-down menu
      value: 'none',
    }
    this.handleUpdateInput = this.handleUpdateInput.bind(this)
    this.handleNewRequest = this.handleNewRequest.bind(this)
    this.clearQuery = this.clearQuery.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    // load all stories into state
    this.storyListener = firebase.database().ref('storyBranch')
    this.storyListener.on('value', snap => {
      const storyBranches = onlyPublished(snap.val())
      this.setState({
        allStoryBranches: storyBranches,
        titles: Object.keys(storyBranches)
      }) // end set state
    })
    // get all tags from the db
    this.tagsListener = firebase.database().ref(`tags`)
    this.tagsListener.on('value', snap => {
      const tags = snap.val()
      if( tags ) {
        for(const tag in tags ) {
          this.setState({
            tags: [...this.state.tags, tag]
          })
        }
      } // end if
    })
  }

  componentWillUnmount() {
    if (this.storyListener) this.storyListener.off()
    if (this.tagsListener) this.tagsListener.off()
  }

  handleUpdateInput(query) {
    this.setState({
      query: query
    })
  }

  // update the state's query but doesn't display
  handleNewRequest(query) {
    this.setState({ query: this.state.query })
  }
  // clears the query from the searchbar
  clearQuery() { this.setState({ query: '' }) }

  handleSubmit(evt) {
    evt.preventDefault()
  }

  handleChange = (event, index, value) => {
    this.setState({value})
  }

  render() {
    const filtered = {}

    if( this.state.value!=='none' ) {
      for(const key in this.state.allStoryBranches) {
        if(this.state.allStoryBranches.hasOwnProperty(key) &&
          this.state.allStoryBranches[key].tags!==undefined &&
          Object.keys(this.state.allStoryBranches[key].tags).indexOf(this.state.value)>-1) {
            filtered[key] = this.state.allStoryBranches[key]
        }
      }
    } else {
      for(const key in this.state.allStoryBranches) {
        if(this.state.allStoryBranches.hasOwnProperty(key) &&
          key.toLowerCase().match(this.state.query.toLowerCase())) {
            filtered[key] = this.state.allStoryBranches[key]
        }
      }
    }

    return (
      <div className="container">
        <form onSubmit={ this.handleSubmit }>
          <AutoComplete
            hintText="Search by title or description"
            dataSource={this.state.titles}
            filter={ AutoComplete.fuzzyFilter }
            floatingLabelText="Search"
            searchText={this.state.query}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.handleNewRequest}
            fullWidth={ true }
          />
        </form>
        {
          this.state.query.length>0 &&
          filtered.length !== this.state.titles.length && (
            <div className='showing-search-results'>
              <span>Now showing {Object.keys(filtered).length} of {this.state.titles.length} total</span>
              <button onClick={this.clearQuery}>Show all</button>
            </div>
          )
        }
        <div>
          <DropDownMenu value={this.state.value} autoWidth={false}
                      onChange={this.handleChange}
                      style={styles.customWidth} className="searchbar-filter">
            <MenuItem value='none' primaryText='(Search by Tag)'/>
            {
              this.state.tags.map( tag => (
                <MenuItem key={tag} value={tag} primaryText={`${tag}`} />
              ))
            }
          </DropDownMenu>
        </div>
        <br/>
        <br/>
        <AllStoryBranches
          searchResults={filtered}
          searching={true}/>
      </div>
    )
  }
}
