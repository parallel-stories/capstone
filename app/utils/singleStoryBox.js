import firebase from 'app/fire'

//returns promise with true/false if branch is in user's storyBranch array
export const isOwnBranch = function(userId,branchTitle) {
  const myStoriesPromise = firebase.database().ref(`user/${userId}/storyBranches`).once('value')
   
  return myStoriesPromise
  .then(snap => {
    if(Object.keys(snap.val()).includes(branchTitle)){
      return true
    }
    else{
      return false
    }
  })
}
