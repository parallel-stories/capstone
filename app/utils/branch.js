import firebase from 'app/fire'
import 'firebase/database'

export const branchCard = function(card) {
  // so far unnecessary
}


/****************
 * delete all dummy data like user id
 * need to deal with duplicate titles so they don't overwrite each other
 * setState on CompDIDMount depending on if isBranch is true or false
 * if isBranch then setState towhatever is in BranchOff button rn
 * put in logic to tell the save and publish button which handler to use
 * whether it is branching off save handler or new story save handler
 * same for publish (are we publishing new story or new branch)
 *
 * after clicking new branch and getting to new_branch route, upon saving the new text, change the url to no longer be "new_branch" but be a write url with the new card ID
 */
