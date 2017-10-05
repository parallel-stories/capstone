import firebase from 'app/fire'
import 'firebase/database'

const createCard = function(card) {
  // create card & generate random firebase key
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
      // if there is a root, set it in branch, otherwise set root to unpublished
      if (card.rootTitle == '') {
        branch.storyCards = [cardKey]
        branch.storyRoot = 'unpublished'
        firebase.database().ref('storyBranch').child(card.branchTitle).set(branch)
      } else {
        firebase.database().ref('storyBranch').child(card.rootTitle).child('storyCards').once('value').then(snap => {
          const branchPoint = snap.val().indexOf(card.prevCard)
          const rootCards = snap.val().slice(0, branchPoint+1)
          branch.storyCards = [...rootCards, cardKey]
          branch.storyRoot = card.rootTitle
          firebase.database().ref('storyBranch').child(card.branchTitle).set(branch)
        })
      }
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
    firebase.database().ref('storyCard').child(cardId).child('branchTitle').once('value').then(snap => {
      // check if title has changed.
      const oldBranchTitle = snap.val()
      firebase.database().ref('storyCard').child(cardId).update(card)
      if (card.branchTitle != oldBranchTitle) {
        updateBranchTitle(card, cardKey, oldBranchTitle)
      }
    })
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
    if (snap.val() == 'unpublished') {
      // set storybranch's root
      firebase.database().ref('storyBranch').child(card.branchTitle).child('storyRoot').set(card.branchTitle)
      // set a root in storyroots
      firebase.database().ref('storyRoot').child(card.branchTitle).child(card.branchTitle).set(true)
      // add root to storycard
      firebase.database().ref('storyCard').child(cardKey).child('rootTitle').set(card.branchTitle)
    }
  })
  // make sure branch is marked as published so that name cannot be rewritten
  firebase.database().ref('storyBranch').child(card.branchTitle).child('published').set(true)

  return cardKey // WriteSpace expects key back
}

const updateBranchTitle = function(card, cardKey, oldBranchTitle) {
  firebase.database().ref('storyBranch').child(oldBranchTitle).once('value').then(snap => {
    const data = snap.val() // save old branch node data to transfer to new
    firebase.database().ref('storyBranch').child(card.branchTitle).set(data)
    firebase.database().ref('storyBranch').child(oldBranchTitle).set(null)
  })
  // update user
  firebase.database().ref('user').child(card.userId).child('storyBranches').child(card.branchTitle).set(true)
  firebase.database().ref('user').child(card.userId).child('storyBranches').child(oldBranchTitle).set(null)
}
