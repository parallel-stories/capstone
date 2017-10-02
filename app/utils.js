import firebase from 'app/fire'

export const getCard = (storyBranchId, cardId, handleCurrentStoryChange) => {
  firebase.database().ref(`storyBranch/${storyBranchId}`).once('value', snap => {
    const storyBranch = snap.val()
    return handleCurrentStoryChange(storyBranchId, storyBranch)
  })
  .then(() => {
    firebase.database().ref(`storyCard/${cardId}`).once('value', snap => {
      console.log('set val after empty')
      this.setState({cards: [...this.state.cards, snap.val()]})
    })
  })
}
