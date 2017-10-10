import firebase from 'app/fire'

//returns true/false if branch is in user's storyBranch array
export const isOwnBranch = function(userId,branchTitle) {
  return firebase.database().ref(`user/${userId}/storyBranches`).once('value')
  .then(snap => {
    if(snap.val().includes(branchTitle)){
      return true
    }
    else{
      return false
    }
  })
}
