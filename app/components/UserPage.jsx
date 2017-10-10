// react
import React, { Component } from 'react'

// firebase
import firebase from 'app/fire'
const auth = firebase.auth()

//components
import AllStoryBranches from './AllStoryBranches'

export default class UserPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: {},
    }
  }

  componentDidMount() {
    const userId = this.props.match.params.id
    this.userListener = firebase.database().ref(`user/${userId}`)
    this.userListener.on('value', user => {
      this.setState({ user: !user.val() ? {} : user.val() })
    })
  }

  componentWillUnmount() {
    if( this.userListener ) this.userListener.off()
  }

  render() {
    const storyBranches = this.state.user.storyBranches
    const favorites = this.state.user.faves

    return (
      <div className="container-fluid" >
        <div>
          <h2><b>{this.state.user.username}</b></h2>
          <p>{this.state.user.description}</p>
          <hr />
          <h2>Stories Authored</h2>
          { !storyBranches || !Object.keys(storyBranches).length?
          <div>
            <p>
              It looks like this user didn't write any stories yet. 😢
            </p>
          </div>
          :
          <div className="row" >
            <AllStoryBranches searchResults={storyBranches} searching={true} />
          </div>
          }
          <h2>This user's favorite stories</h2>
          { !favorites || !Object.keys(favorites).length ?
          <div>
            <p>
              It looks like this user didn't like any stories yet. 😢
            </p>
          </div>
          :
          <div className="row" >
            <AllStoryBranches searchResults={favorites} searching={true} />
          </div>
          }
        </div>
      </div>
    )
  }
  }
