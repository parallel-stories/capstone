import React, { Component } from 'react';

// material UI
import AutoComplete from 'material-ui/AutoComplete';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

// react components
import AllStoryBranches from './AllStoryBranches';

class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allStoryBranches: ['harry potter', 'the last unicorn', 'Dune'],
      searchResults: [],
      query: '',
      postive: true,
    }
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleNewRequest = this.handleNewRequest.bind(this);
    this.clearQuery = this.clearQuery.bind(this);
  }

  handleUpdateInput(query) {
    this.setState({
      query: query
    })
  }

  // update the state's query and also clears query
  handleNewRequest(evt) { this.setState({ query: this.state.query }) }
  clearQuery() { this.setState({ query: '' }) }

  render() {
    return (
      <div className="container">
        <form onSubmit={ this.handleSubmit }>
          <AutoComplete
            hintText="Search by title or description"
            dataSource={this.state.allStoryBranches}
            filter={ AutoComplete.fuzzyFilter }
            floatingLabelText="Search"
            searchText={this.state.query}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.handleNewRequest}
            fullWidth={ true }
          />
        </form>
        <br />
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
      </div>
    )
  }
}

export default Searchbar;
