// react
import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'

// material ui
import IconButton from 'material-ui/IconButton'
import EditPen from 'material-ui/svg-icons/editor/mode-edit'
import Save from 'material-ui/svg-icons/action/check-circle'
import TextField from 'material-ui/TextField'

// firebase
import firebase from 'app/fire'
import 'firebase/database'
const auth = firebase.auth()

//components
import AllStoryBranches from './AllStoryBranches'
import AllUsers from './AllUsers'

import _ from 'lodash'

// styling for button
const landingStyles = {
  button: {
    boxShadow: "none",
    marginBottom: "20px",
    minWidth:"75px"
  },
}

export default class EditUserProfile extends Component {
  constructor(props){
    super(props)
  }

  render() {
    const { user, toggleEdit, displayName, description } = this.props

    if( this.props.isEditing ) {
      return (
        <div>
          <span>
            <h1>
              Welcome {user.displayName}!
              <IconButton tooltip="Save your edits!"
                    onClick={toggleEdit}>
                <Save />
              </IconButton>
            </h1>
          </span>
          <p><b>Email: </b>{user.email}</p>
          <div>
            <span>
              <b>Display Name: </b><TextField id="display-name"
                                          defaultValue={displayName}
                                          onChange={this.props.editDisplayName}/>
            </span>
          </div>
          <div>
            <span>
              <b></b><TextField id="desc"
                            defaultValue={description}
                            onChange={this.props.editDesc}
                            fullWidth={true}
                            multiLine={true}/>
            </span>
          </div>
        </div>
      )
    }
    return (
      <div>
        <span>
          <h1>
            Welcome {user.displayName}!
            <IconButton tooltip="Edit your display name and/or profile description"
                onClick={toggleEdit}>
              <EditPen />
            </IconButton>
          </h1>
        </span>
        <p><b>Email: </b>{user.email}</p>
        <p><b>Display Name: </b>{displayName}</p>
        <p>{description}</p>
      </div>
    )
  }
}
