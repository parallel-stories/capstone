/* global $ */

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
      currentBranchId: '',
      tree: {},
      treeWidth: 0,
      treeHeight: 0,
    }
  }

  componentDidMount() {
    this.resizeState = () => this.setState({treeHeight: $(window).height() - 100, treeWidth: $(window).width() - 50})
    $(window).on('resize', this.resizeState)

    const branchId = this.props.match.params.branchId

    const treeBuild = (branchRootId, clickedBranchId) => {
      const promiseTree = new Promise((resolve, reject) => {
        const treeData = {
          name: branchRootId,
          children: [],
          key: branchRootId,
          className: branchRootId === clickedBranchId ? 'node tree-click-branch' : 'node',
          onClick: () => history.push(`/read/${branchRootId}`)
        }
        firebase.database().ref(`storyRoot/${branchRootId}`).once('value')
        .then(childrenSnap => {
          if (childrenSnap.val()) {
            const keys = Object.keys(childrenSnap.val()).filter(child => child !== 'isRoot')
            keys.forEach(key => treeData.children.push(treeBuild(key, clickedBranchId)))
          }
          Promise.all(treeData.children)
          .then(childrenTree => {
            treeData.children = [...childrenTree]
            resolve(treeData)
          })
        })
      })
      return promiseTree
    }

    firebase.database().ref(`storyBranch/${branchId}`).once('value')
    .then(currentBranch => {
      const branchRootId = currentBranch.val().storyRoot.length > 1 ? currentBranch.val().storyRoot[1] : branchId
      return treeBuild(branchRootId, branchId)
    })
    .then(resTree => {
      this.setState({tree: resTree, treeHeight: $(window).height() - 100, treeWidth: $(window).width() - 50})
    })
  }

  componentWillUnmount() {
    $(window).off('resize', this.resizeState)
  }

  render() {
    const branchId = this.props.match.params.branchId
    return (
      <div>
        <div className="align-center">
          <h2>Story Tree of "{branchId}"</h2>
        </div>
        <div className="align-center .tree-container" width={this.state.treeWidth} height={this.state.treeHeight}>
          <Tree data={this.state.tree} nodeOffset={17} treeClassName="cardBranchTree" width={this.state.treeWidth} height={this.state.treeHeight} animated />
        </div>
      </div>
    )
  }
}
