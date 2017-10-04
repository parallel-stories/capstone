import firebase from 'app/fire'
import 'firebase/database'

const createCard = function(card) {
  // create card & generate random firebase key
  // OB/FF: look out for async issues
  const cardKey = firebase.database().ref('storyCard').push(card).key
  // update previous card to point to this one
  if (card.prevCard) {
    firebase.database().ref('storyCard').child(card.prevCard).child('nextCard').set(cardKey)
  }
  // check if branch exists (by checking storyCards so you can get that return value)
    // if so, add card to card array
    // if not, create branch, mark unpublished, create card array
  firebase.database().ref('storyBranch').child(card.branchTitle).child('storyCards').once('value').then(snap => {
    if (snap.exists()) {
      const cards = [...snap.val(), cardKey]
      firebase.database().ref('storyBranch').child(card.branchTitle).child('storyCards').set(cards)
    } else {
      const branch = {}
      branch.storyRoot = 'unpublished'
      branch.storyCards = [cardKey]
      firebase.database().ref('storyBranch').child(card.branchTitle).set(branch)
    }
  })
  // add branch to user branches if it doesn't exist
  firebase.database().ref('user').child(card.userId).child('storyBranches').child(card.branchTitle).set(true)
  // WriteSpace needs key back for local state
  return cardKey
}

const createOrUpdateCard = function(card, cardId) {
  let cardKey = cardId
  if (cardId == '') {
    cardKey = createCard(card) // returns firebase key
  } else {
    firebase.database().ref('storyCard').child(cardId).update(card)
  }
  return cardKey // WriteSpace expects key back
}

export const saveCard = function(card, cardId) {
  card.published = false
  return createOrUpdateCard(card, cardId) // returns firebase key
}

export const publishCard = function(card, cardId) {
  card.published = true
  const cardKey = createOrUpdateCard(card, cardId) // returns firebase key

  // if branch's root is marked unpublished, create storyroot with branch's name, include that branch as child of root, and update branch's root from unpublished to new name
  firebase.database().ref('storyBranch').child(card.branchTitle).child('storyRoot').once('value').then(snap => {
    // OB/FF: you might be able to implement this as a database rule in firebase
    if (snap.val() == 'unpublished') {
      firebase.database().ref('storyBranch').child(card.branchTitle).child('storyRoot').set(card.branchTitle)
      firebase.database().ref('storyRoot').child(card.branchTitle).child(card.branchTitle).set(true)
    }
  })
  // make sure branch is marked as published so that name cannot be rewritten
  firebase.database().ref('storyBranch').child(card.branchTitle).child('published').set(true)

  return cardKey // WriteSpace expects key back
}

export const saveBranchTitle = function(card, cardId) {
  let cardKey = cardId
  if (cardId == '') {
    cardKey = saveCard(card, cardId) // returns firebase key
  } else {
    firebase.database().ref('storyCard').child(cardKey).child('branchTitle').once('value').then(snap => {
      // OB/FF: could potentially implement this as a cloud function (pushing logic further "back")
      if (snap.val() != card.branchTitle) {
        // update storybranch
        firebase.database().ref('storyBranch').child(snap.val()).once('value').then(branchSnap => {
          let data = branchSnap.val()
          firebase.database().ref('storyBranch').child(card.branchTitle).set(data)
          firebase.database().ref('storyBranch').child(snap.val()).set(null)
        })
        // update storycard
        firebase.database().ref('storyCard').child(cardId).child('branchTitle').set(card.branchTitle)
        // update user
        firebase.database().ref('user').child(card.userId).child('storyBranches').child(card.branchTitle).set(true)
        firebase.database().ref('user').child(card.userId).child('storyBranches').child(snap.val()).set(null)
      }
    })
  }
  return cardKey
}
