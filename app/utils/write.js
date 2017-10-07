import firebase from 'app/fire'
import 'firebase/database'

const createCard = function(card) {
  // create card & generate random firebase key
  const cardKey = firebase.database().ref('storyCard').push(card).key
  // update previous card to point to this one
  if (card.prevCard) {
    firebase.database().ref(`storyCard/${card.prevCard}/nextCard`).set(cardKey)
  }
  // add branch to user branches if it doesn't exist
  firebase.database().ref(`user/${card.userId}/storyBranches/${card.branchTitle}`).set(true)

  // check if branch exists (by checking storyCards so you can get that return value)
  firebase.database().ref(`storyBranch/${card.branchTitle}/storyCards`).once('value').then(snap => {
    // if so, add card to card array
    if (snap.exists()) {
      const cards = [...snap.val(), cardKey]
      firebase.database().ref(`storyBranch/${card.branchTitle}/storyCards`).set(cards)
    // else if branch does not exist, create branch and create card array
    } else {
      // set storybranch's root
      firebase.database().ref(`storyBranch/${card.branchTitle}/storyRoot`).set(card.rootTitle)     // if this is an original root branch
      if (card.rootTitle.length == 1) {
        // initiate cardArray
        firebase.database().ref(`storyBranch/${card.branchTitle}/storyCards`).set([cardKey])
        // in same level as branches, give key isRoot set to true
        firebase.database().ref(`storyRoot/${card.branchTitle}/isRoot`).set(true)
      // else if this is a branch off a root, add it to storyRoot array, and slice the cards array at the branch point and add the new card to the end
      } else {
        firebase.database().ref(`storyBranch/${card.rootTitle[card.rootTitle.length-1]}`).once('value').then(snap => {
          // add card to appropriate point in cardArray
          const branchPoint = snap.val().storyCards.indexOf(card.prevCard)
          const rootCards = snap.val().storyCards.slice(0, branchPoint+1)
          firebase.database().ref(`storyBranch/${card.branchTitle}/storyCards`).set([...rootCards, cardKey])
          // add to storyRoot with child branch
          firebase.database().ref(`storyRoot/${card.rootTitle[card.rootTitle.length-1]}/${card.branchTitle}`).set(true)
          // add branch point to previous card
          firebase.database().ref(`storyCard/${card.prevCard}/branches/${card.branchTitle}`).set(cardKey)
        })
      }
    }
  })
  // WriteSpace needs key back for local state
  return cardKey
}

const createOrUpdateCard = function(card, cardId, publishThisBranch) {
  let cardKey = cardId
  // if new card, create card
  if (cardId == '') {
    cardKey = createCard(card) // returns firebase key
  // else update card
  } else {
    // check if title has changed from old db info, THEN update db w new info
    firebase.database().ref(`storyCard/${cardId}/branchTitle`).once('value').then(snap => {
      const oldBranchTitle = snap.val()
      // only update card info AFTER retrieving orig data
      firebase.database().ref(`storyCard/${cardId}`).update(card)
      if (card.branchTitle != oldBranchTitle) {
        updateBranchTitle(card, cardKey, oldBranchTitle, publishThisBranch)
      }
    })
  }
  // keep track of user's unpublished cards. null instead of false as null will cause firebase to remove reference to a published card.
  const unpub = (card.published) ? null : true
  firebase.database().ref(`user/${card.userId}/unpublishedCards/${cardKey}`).set(unpub)
  // if 3rd argument boolean "publishThisBranch" is passed in, set branch to published so its name can't be edited
  publishThisBranch
    && firebase.database().ref(`storyBranch/${card.branchTitle}/published`).set(true)
  // WriteSpace expects key back
  return cardKey
}

export const saveCard = function(card, cardId) {
  card.published = false
  return createOrUpdateCard(card, cardId) // returns firebase key
}

export const publishCard = function(card, cardId) {
  card.published = true
  // set branch to published so its name cant be edited
  const publishThisBranch = true
  // WriteSpace expects key back
  return createOrUpdateCard(card, cardId, publishThisBranch) // returns firebase key
}

const updateBranchTitle = function(card, cardKey, oldBranchTitle, publishThisBranch) {
  // update storyBranch
  firebase.database().ref(`storyBranch/${oldBranchTitle}`).once('value').then(snap => {
    // save old branch node data to transfer to new
    const data = snap.val()
    // doublecheck if branch should be marked published so this isn't overwritten w async functions
    if (publishThisBranch) data.published = true
    // create new branch node and set old to null to remove it
    firebase.database().ref(`storyBranch/${card.branchTitle}`).set(data)
    firebase.database().ref(`storyBranch/${oldBranchTitle}`).set(null)
  })
  // update storyRoot top-level if branch is not child
  firebase.database().ref(`storyRoot/${oldBranchTitle}`).once('value').then(snap => {
    // if the branch is not a root, snap.val() doesn't exist, this won't do anything anyway
    const data = snap.val()
    firebase.database().ref(`storyRoot/${card.branchTitle}`).set(data)
    firebase.database().ref(`storyRoot/${oldBranchTitle}`).set(null)
  })
  // update storyRoot parent if branch is child
  if (card.rootTitle.length > 1) {
    firebase.database().ref(`storyRoot/${card.rootTitle[card.rootTitle.length-1]}/${oldBranchTitle}`).once('value').then(snap => {
      const data = snap.val()
      firebase.database().ref(`storyRoot/${card.branchTitle}`).set(data)
      firebase.database().ref(`storyRoot/${oldBranchTitle}`).set(null)
    })
  }
  // update user
  firebase.database().ref(`user/${card.userId}/storyBranches/${card.branchTitle}`).set(true)
  firebase.database().ref(`user/${card.userId}/storyBranches/${oldBranchTitle}`).set(null)
}
