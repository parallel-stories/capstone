import firebase from 'app/fire'

export const getCardBranchScene = function(cardId) {
  return firebase.database().ref(`storyCard/${cardId}/branchTitle`).once('value')
  .then(snap => {
    return snap.val()
  })
  .then(branchTitle => {
    return firebase.database().ref(`storyBranch/${branchTitle}/storyCards`).once('value') 
      .then(snap => {
        if(snap.val()) {
          return `from ${branchTitle}, scene ${snap.val().length}`
        }
    })
  })
}
