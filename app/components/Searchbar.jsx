import React, { Component } from 'react'

// material UI
import AutoComplete from 'material-ui/AutoComplete'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'
import ActionFavorite from 'material-ui/svg-icons/action/favorite'
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border'

// firebase
import firebase from 'app/fire'

// react components
import AllStoryBranches from './AllStoryBranches'

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
      const storyBranches = snap.val()
      this.setState({
        allStoryBranches: storyBranches,
        titles: Object.keys(storyBranches)
      }) // end set state
    })
  }

  componentWillUnmount() {
    this.storyListener.off()
  }

  // TODO: prevent refresh when the enter key is hit
  // displays what is being written in the search
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

  render() {
    const filtered = {}

    for(const key in this.state.allStoryBranches) {
      if(this.state.allStoryBranches.hasOwnProperty(key) &&
        key.toLowerCase().match(this.state.query.toLowerCase())) {
          filtered[key] = this.state.allStoryBranches[key]
      }
    }


    return (
      <div className="container">
        <h2 className="align-center">All Stories</h2>
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
        <RadioButtonGroup style={{display: 'flex', flexDirection: 'row', maxWidth: 85}}
          name="search-by" defaultSelected="all">
          <RadioButton
            value="all"
            label="All" />
          <RadioButton
            value="title"
            label="Title" />
          <RadioButton
            value="desc"
            label="Description" />
        </RadioButtonGroup>
        <AllStoryBranches
          searchResults={filtered}
          searching={true}/>
      </div>
    )
  }
}
