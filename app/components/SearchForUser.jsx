import React, { Component } from 'react'

// material UI
import AutoComplete from 'material-ui/AutoComplete'

// firebase
import firebase from 'app/fire'
import 'firebase/database'

// react components
import AllUsers from './AllUsers'

export default class SearchForUser extends Component {
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
    firebase.database().ref().child('storyBranch').on('value', snap => {
      const storyBranches = snap.val()
      this.setState({
        allStoryBranches: storyBranches,
        titles: Object.keys(storyBranches)
      }) // end set state
    })

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
        <form onSubmit={ this.handleSubmit }>
          <AutoComplete
            hintText="Search for a User"
            dataSource={this.state.titles}
            filter={ AutoComplete.fuzzyFilter }
            floatingLabelText="Search for a User"
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
        <AllUsers />
      </div>
    )
  }
}
