import firebase from 'app/fire'

//returns true/false if branch is in user's storyBranch array
export const isOwnBranch = function(userId,branchTitle) {
  console.log('uid ', userId)
  console.log('branch', branchTitle)

  if(userId){
    const myStoriesPromise = firebase.database().ref(`user/${userId}/storyBranches`).once('value')
    console.log(myStoriesPromise)
    
    return myStoriesPromise
    .then(snap => {
      if(Object.keys(snap.val()).includes(branchTitle)){
        console.log(branchTitle+'my story')
        return true
      }
      else{
        console.log(branchTitle+'not mine')
        return false
      }
    })
  }
  console.log('WHAT IS HAPPENING')
}
