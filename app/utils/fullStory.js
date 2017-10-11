import firebase from 'app/fire'

export const getBranchInfo = (id) => firebase.database().ref(`storyBranch/${id}`).once('value', snap => snap.val())

export const getStoryInfo = (cardArr) => cardArr.map(cardId => firebase.database().ref(`storyCard/${cardId}`).once('value', snap => snap.val()))
