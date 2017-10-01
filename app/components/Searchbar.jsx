import React, { Component } from 'react';

// material UI
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

// react components
import AllStoryBranches from './AllStoryBranches';

class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      query: ''
    }
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleNewRequest = this.handleNewRequest.bind(this);
    this.clearQuery = this.clearQuery.bind(this);
  }

  handleUpdateInput(query) {
    this.setState({
      query: query
    })
    console.log(this.state.query)
  }

  // update the state's query and also clears query
  handleNewRequest() { this.setState({ query: this.state.query }) }
  clearQuery() { this.setState({ query: '' }) }


  render() {
    return (
      <div className="container">
        <form onSubmit={ this.handleSubmit }>
          <AutoComplete
            hintText="Search by title or description"
            dataSource={[1,2,3,4]}
            filter={ AutoComplete.fuzzyFilter }
            floatingLabelText="Search"
            searchText={this.state.query}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.handleNewRequest}
            fullWidth={ true }
          />
        </form>
        <div>
          <AllStoryBranches filteredBranches={this.state.searchResults} />
        </div>
      </div>
    )
  }
}

export default Searchbar;
