import firebase from 'app/fire'
import 'firebase/database'

const createCard = function(card, pubBranch) {
  // create card & generate random firebase key
  const cardKey = firebase.database().ref('storyCard').push(card).key
  // update previous card to point to this one
  if (card.prevCard) {
    firebase.database().ref(`storyCard/${card.prevCard}/nextCard`).set(cardKey)
  }
  // check if branch exists (by checking storyCards so you can get that return value)
    // if so, add card to card array
  firebase.database().ref(`storyBranch/${card.branchTitle}/storyCards`).once('value').then(snap => {
    if (snap.exists()) {
      const cards = [...snap.val(), cardKey]
      firebase.database().ref(`storyBranch/${card.branchTitle}/storyCards`).set(cards)
    }
    // else if branch does not exist, create branch and create card array
    else {
      const branch = pubBranch || {}
      // if there is no root, set storyRoot to be isRoot
      if (card.rootTitle == '') {
        // create cardArray
        branch.storyCards = [cardKey]
        // set storybranch's root
        const isRoot = ['isRoot']
        branch.storyRoot = isRoot
        firebase.database().ref(`storyBranch/${card.branchTitle}`).set(branch)
        // add root to storycard
        firebase.database().ref(`storyCard/${cardKey}/rootTitle`).set(isRoot)
        // in same level as branches, give key isRoot set to true
        firebase.database().ref(`storyRoot/${card.branchTitle}/isRoot`).set(true)
      }
      // else if there is a root add it to storyRoot array
      else {
        firebase.database().ref(`storyBranch/${card.rootTitle}`).once('value').then(snap => {
          const branchPoint = snap.val().storyCards.indexOf(card.prevCard)
          const rootCards = snap.val().storyCards.slice(0, branchPoint+1)
          branch.storyCards = [...rootCards, cardKey]
          branch.storyRoot = [...snap.val().storyRoot, card.rootTitle]
          firebase.database().ref(`storyBranch/${card.branchTitle}`).set(branch)
          firebase.database().ref(`storyCard/${cardKey}/rootTitle`).set(branch.storyRoot)
          firebase.database().ref(`storyRoot/${card.rootTitle}/${card.branchTitle}`).set(true)
          firebase.database().ref(`storyCard/${card.prevCard}/branches`).set(true)
          firebase.database().ref(`storyCard/${card.prevCard}/branches/${card.branchTitle}`).set(cardKey)
        })
      }
    }
  })
  // add branch to user branches if it doesn't exist
  firebase.database().ref(`user/${card.userId}/storyBranches/${card.branchTitle}`).set(true)
  // WriteSpace needs key back for local state
  return cardKey
}

const createOrUpdateCard = function(card, cardId, branch) {
  let cardKey = cardId
  if (cardId == '') {
    cardKey = createCard(card, branch) // returns firebase key
  } else {
    firebase.database().ref(`storyCard/${cardId}/branchTitle`).once('value').then(snap => {
      // check if title has changed.
      const oldBranchTitle = snap.val()
      firebase.database().ref(`storyCard/${cardId}`).update(card)
      if (card.branchTitle != oldBranchTitle) {
        updateBranchTitle(card, cardKey, oldBranchTitle)
      }
    })
  }
  // keep track of user's unpublished cards. null instead of false as null will cause firebase to remove reference to a published card.
  const unpub = (card.published) ? null : true
  firebase.database().ref(`user/${card.userId}/unpublishedCards/${cardKey}`).set(unpub)
  // WriteSpace expects key back
  return cardKey
}

export const saveCard = function(card, cardId) {
  card.published = false
  return createOrUpdateCard(card, cardId) // returns firebase key
}

export const publishCard = function(card, cardId) {
  card.published = true
  const branch = {}
  // set branch to published so its name cant be edited
  branch.published = true
  const cardKey = createOrUpdateCard(card, cardId, branch) // returns firebase key

  return cardKey // WriteSpace expects key back
}

const updateBranchTitle = function(card, cardKey, oldBranchTitle) {
  firebase.database().ref(`storyBranch/${oldBranchTitle}`).once('value').then(snap => {
    const data = snap.val() // save old branch node data to transfer to new
    firebase.database().ref(`storyBranch/${card.branchTitle}`).set(data)
    firebase.database().ref(`storyBranch/${oldBranchTitle}`).set(null)
  })
  // update user
  firebase.database().ref(`user/${card.userId}/storyBranches/${card.branchTitle}`).set(true)
  firebase.database().ref(`user/${card.userId}/storyBranches/${oldBranchTitle}`).set(null)
}
