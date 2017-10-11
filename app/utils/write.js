import firebase from 'app/fire'

export const saveCard = function(card, cardId) {
  card.published = false
  return createAndOrUpdateCard(card, cardId) // returns firebase key
}

export const publishCard = function(card, cardId) {
  card.published = true
  return createAndOrUpdateCard(card, cardId) // returns firebase key
}

const createAndOrUpdateCard = function(card, cardId) {
  // if new card, create card
  if (cardId == '') {
    return createCard(card)
    .then(cardKey => updateCard(card, cardId, cardKey)) // returns firebase key
  } else {
    const cardKey = cardId
    // check if title has changed from old db info, THEN update db w new info
    return firebase.database().ref(`storyCard/${cardId}/branchTitle`).once('value')
    .then(snap => {
      const oldBranchTitle = snap.val()
      // only update card info AFTER retrieving orig data
      return firebase.database().ref(`storyCard/${cardId}`).update(card)
      .then(() => (card.branchTitle != oldBranchTitle) && updateBranchTitle(card, cardKey, oldBranchTitle))
    })
    .then(() => updateCard(card, cardId, cardKey)) // returns firebase key
  }
}

const createCard = function(card) {
  // create card & generate random firebase key
  return firebase.database().ref('storyCard').push(card)
  .then(snap => {
    const cardKey = snap.key
    // add branch to user branches if it doesn't exist
    return firebase.database().ref(`user/${card.userId}/wnches/${card.branchTitle}`).set(true)
    // update previous card to point to this one
    .then(() => card.prevCard && firebase.database().ref(`storyCard/${card.prevCard}/nextCard`).set(cardKey))
    // keep returning card key
    .then(() => new Promise((resolve, reject) => resolve(cardKey)))
  })
  .then(cardKey => {
    // check if branch exists (by checking its storyCards so you can get that return value)
    return firebase.database().ref(`storyBranch/${card.branchTitle}/storyCards`).once('value')
    .then(snap => {
      // if so, add card to card array
      if (snap.exists()) {
        const cards = [...snap.val(), cardKey]
        return firebase.database().ref(`storyBranch/${card.branchTitle}/storyCards`).set(cards)
        .then(() => new Promise((resolve, reject) => resolve(cardKey)))
      // else if branch does not exist, create branch and create card array
      } else {
        // set storybranch's root
        return firebase.database().ref(`storyBranch/${card.branchTitle}/storyRoot`).set(card.rootTitle)
        // add storybranch's user
        .then(() => firebase.database().ref(`storyBranch/${card.branchTitle}/userId`).set(card.userId))
        .then(() => firebase.database().ref(`storyBranch/${card.branchTitle}/description`).set(card.branchDesc))
        .then(() => {
          // if this is an original root branch
          if (card.rootTitle.length === 1) {
            // initiate cardArray
            return firebase.database().ref(`storyBranch/${card.branchTitle}/storyCards/0`).set(cardKey)
            // in same level as branches, give key isRoot set to true
            .then(() => firebase.database().ref(`storyRoot/${card.branchTitle}/isRoot`).set(true))
            .then(() => new Promise((resolve, reject) => resolve(cardKey)))
          // else if this is a branch off a root, add it to storyRoot array, and slice the cards array at the branch point and add the new card to the end
          } else {
            return firebase.database().ref(`storyBranch/${card.rootTitle[card.rootTitle.length-1]}`).once('value')
            .then(snap => {
              // add card to appropriate point in cardArray
              const branchPoint = snap.val().storyCards.indexOf(card.prevCard)
              const rootCards = snap.val().storyCards.slice(0, branchPoint+1)
              return firebase.database().ref(`storyBranch/${card.branchTitle}/storyCards`).set([...rootCards, cardKey])
              // add to storyRoot with child branch
              .then(() => firebase.database().ref(`storyRoot/${card.rootTitle[card.rootTitle.length-1]}/${card.branchTitle}`).set(true))
              // add branch point references
              .then(() => firebase.database().ref(`storyBranch/${card.branchTitle}/branchPoint/from`).set(card.prevCard))
              .then(() => firebase.database().ref(`storyBranch/${card.branchTitle}/branchPoint/to`).set(cardKey))
              .then(() => new Promise((resolve, reject) => resolve(cardKey)))
            })
            .then(() => new Promise((resolve, reject) => resolve(cardKey)))
          }
        })
        .then(() => new Promise((resolve, reject) => resolve(cardKey)))
      }
    })
  })
  // WriteSpace needs key back for local state
  .then((cardKey) => new Promise((resolve, reject) => resolve(cardKey)))
}

const updateCard = function(card, cardId, cardKey) {
  // keep track of user's unpublished cards. null instead of false as null will cause firebase to remove reference to a published card.
  const unpub = (card.published) ? null : true
  return firebase.database().ref(`user/${card.userId}/unpublishedCards/${cardKey}`).set(unpub)
  .then(() => {
    // if card is marked as published ...
    if (card.published) {
      // ... set branch to published so its name can't be edited
      return firebase.database().ref(`storyBranch/${card.branchTitle}/published`).set(true)
      .then(() => {
        // add branchpoint to its story root card
        if (card.rootTitle.length > 1) {
          return firebase.database().ref(`storyBranch/${card.branchTitle}`).once('value')
          .then(snap => {
            const branchFrom = snap.val().branchPoint.from
            const branchTo = snap.val().branchPoint.to
            return firebase.database().ref(`storyCard/${branchFrom}/branches/${card.branchTitle}`).set(branchTo)
          })
        }
      })
    } else return true
  })
  .then(() => new Promise((resolve, reject) => resolve(cardKey)))
}

const updateBranchTitle = function(card, cardKey, oldBranchTitle) {
  // update storyBranch
  return firebase.database().ref(`storyBranch/${oldBranchTitle}`).once('value')
  .then(snap => {
    // save old branch node data to transfer to new
    const data = snap.val()
    // create new branch node
    return firebase.database().ref(`storyBranch/${card.branchTitle}`).set(data)
  })
  // and set old to null to remove it
  .then(() => firebase.database().ref(`storyBranch/${oldBranchTitle}`).set(null))
  // update storyRoot top-level if branch is not child
  .then(() => firebase.database().ref(`storyRoot/${oldBranchTitle}`).once('value'))
  .then(snap => {
    // if the branch is not a root, snap.val() doesn't exist, this won't do anything anyway
    const data = snap.val()
    return firebase.database().ref(`storyRoot/${card.branchTitle}`).set(data)
  })
  // ditto (if branch isn't root, this won't do anything)
  .then(() => firebase.database().ref(`storyRoot/${oldBranchTitle}`).set(null))
  // update storyRoot parent if branch is child
  .then(() => {
    if (card.rootTitle.length > 1) {
      return firebase.database().ref(`storyRoot/${card.rootTitle[card.rootTitle.length-1]}/${oldBranchTitle}`).once('value')
      .then(snap => {
        // if the branch is not a root, snap.val() doesn't exist, this won't do anything anyway
        const data = snap.val()
        return firebase.database().ref(`storyRoot/${card.rootTitle[card.rootTitle.length-1]}/${card.branchTitle}`).set(data)
      })
      .then(() => firebase.database().ref(`storyRoot/${card.rootTitle[card.rootTitle.length-1]}/${oldBranchTitle}`).set(null))
    } else return true
  })
  // update user
  .then(() => firebase.database().ref(`user/${card.userId}/storyBranches/${card.branchTitle}`).set(true))
  .then(() => firebase.database().ref(`user/${card.userId}/storyBranches/${oldBranchTitle}`).set(null))
  .then(() => new Promise((resolve, reject) => resolve(cardKey))) // j.i.c.
}
