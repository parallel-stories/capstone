import React from 'react'
import firebase from 'app/fire'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Link} from 'react-router-dom'


export const getStoryBranch = storyBranchId => firebase.database().ref(`storyBranch/${storyBranchId}`).once('value')

export const getStoryCard = cardId => firebase.database().ref(`storyCard/${cardId}`).once('value')

export const getDialogBox = (title, message, actions, openState, autoScroll) => {
  return (
    <Dialog
      title={title || ''}
      actions={actions}
      modal={true}
      open={openState}
      autoScrollBodyContent={autoScroll}
    >
      {message}
    </Dialog>
  )
}

export const getCancelAlertButton = (callback) => {
  return [
    <FlatButton
      label="Cancel"
      primary={true}
      onClick={callback}
    />
  ]
}

// for use in AllStoryBranches
export const onlyPublished = (storyObj) => {
  const pubStories = {}
  for (const key in storyObj) {
    if (storyObj[key].published) pubStories[key] = storyObj[key]
  }
  return pubStories
}
