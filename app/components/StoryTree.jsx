import React, { Component } from 'react'
import {Link} from 'react-router-dom'

// firebase
import firebase from 'app/fire'

// utils
import history from '../history'
import _ from 'lodash'

// tree graph
import Tree from 'react-tree-graph'

export default class SingleStoryRoot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentBranchId: ''
    }
  }

  componentDidMount() {

    const promiseArr = []
    const treeTraversal = (branchRootId) => {
      promiseArr.push(firebase.database().ref(`storyRoot/${branchRootId}`).once('value'))
      return firebase.database().ref(`storyRoot/${branchRootId}`).once('value').then(childrenSnap => {
        const children = Object.keys(childrenSnap.val()).filter(child => child !== 'isRoot')
        console.log('children:', children)
        if (children.length) {
          children.forEach(child => treeTraversal(child))
        }
      })
    }

    const branchId = this.props.match.params.branchId
    firebase.database().ref(`storyBranch/${branchId}`).once('value', branchSnap => {
      const branchRoot = branchSnap.val().storyRoot.length > 1 ? branchSnap.val().storyRoot[1] : branchId
      console.log('branchRoot:', branchRoot)
      treeTraversal(branchRoot)
    })
    .then(() => {
      console.log('PROMISE ARR', promiseArr)
      return Promise.all(promiseArr)
    })
    .then(resultArr => {
      console.log('RESULT:', resultArr[0].val())
    })
    // this.setState({currentBranchId: branchId})
  }

  render() {
    return (
      <div>
      {
        // <Tree data={data} treeClassName="cardBranchTree" width={600} height={600} nodOffset={15} animated />
      }
      </div>
    )
  }
}
