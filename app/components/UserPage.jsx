// react
import React, { Component } from 'react'

// firebase
import firebase from 'app/fire'
import 'firebase/database'
const auth = firebase.auth()

//components
import AllStoryBranches from './AllStoryBranches'

export default class UserPage extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: {},
      storyBranches: {},
      favorites: {},
    }

  }

  render() {
    const { user, storyBranches, favorites } = this.state || {}

    return (
      <div className="container-fluid" >
        <div>
          <h1><em>User: </em> {user.displayName || 'This user has no name'}</h1>
          <p> A description will go here </p>
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
            <AllStoryBranches searchResults={storyBranches} searching={true} />
          </div>
          }
        </div>
      </div>
    )
  }
  }
