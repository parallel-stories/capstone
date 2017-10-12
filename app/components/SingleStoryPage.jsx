import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import firebase from 'app/fire'
import _ from 'lodash'
import FlatButton from 'material-ui/FlatButton'

// react components
import Reviews from './Reviews'

// tagging imports
import ChipInput from 'material-ui-chip-input'

export default class SingleStoryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStoryBranch: {},
      tags: [],
      imageURL: 'https://giphy.com/embed/3o85xonfOvQzN3eCNG',
      author: {
        id: '',
        username: ''
      }
    }
  }

  componentDidMount() {
    const storyBranchId = this.props.match.params.branchId
    firebase.database().ref(`storyBranch/${storyBranchId}`).once('value')
    .then(snap => {
      this.setState({currentStoryBranch: snap.val()})
      return snap.val()
    })
    // load author
    .then(storyBranch => {
      firebase.database().ref(`user/${storyBranch.userId}`).once('value')
      .then(snap => {
        this.setState({
          author: {
            id: storyBranch.userId,
            username: snap.val().username
          }
        })
      })
    })
    // get tags for this story branch
    this.tagsListener = firebase.database().ref(`storyBranch/${this.props.match.params.branchId}/tags`)
    this.tagsListener.on('value', snap => {
      const tags = snap.val()
      if( tags ) {
        this.setState({
          tags: Object.keys(tags)
        })
      } // end if
    })
    // get an image from getty
    this.getImage(this.props.match.params.branchId)
  }

  componentWillUnmount() {
    if(this.tagsListener) this.tagsListener.off()
  }

  getImage = (query) => {
    const apiKey = 'l8WLH4sOyOBYS502ZWwnJIEIElfeIXWs'
    const source = `https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${apiKey}&rating=G&limit=20`

    /* grabs the first image from getty API that matches the query */
    fetch(`${source}`)
      .then(res => res.json())
      .then(data => {
        const rand = Math.floor(Math.random() * 20)
        const slug = data.data[rand].id
        this.setState({ imageURL: `https://giphy.com/embed/${slug}` })
      })
      .catch(() => console.log("error"))

  }

  handleAddTag = (newTag) => {
    /*
    Here because data sent to firebase cannot contain
    ".", "#", "$", "[", "]"
    */
    if(newTag.includes(".")||newTag.includes("#")||newTag.includes("$")||newTag.includes("[")||newTag.includes("]")) {
      alert(`tags cannot contain ".", "#", "$", "[", or "]" `)
    } else {
      this.setState({
        tags: [...this.state.tags, newTag]
      })
      // add to tags db
      firebase.database().ref('tags').child(newTag).child(this.props.match.params.branchId).set(true)
      // add to tags in story db
      firebase.database().ref('storyBranch').child(this.props.match.params.branchId).child('tags').child(newTag).set(true)
    }
  }

  handleDeleteTag = (deleteMe) => {
    this.setState({
      tags: this.state.tags.filter(tag => tag !== deleteMe)
    })

    // remove from tags db
    firebase.database().ref('tags').child(deleteMe).child(this.props.match.params.branchId).remove()
    // remove this tag from story db
    firebase.database().ref('storyBranch').child(this.props.match.params.branchId).child('tags').child(deleteMe).remove()
  }

  render() {
    const storyBranchId = this.props.match.params.branchId
    const storyBranch = this.state.currentStoryBranch

    const getStoryRootTitle = () => {
      const roots = _.isEmpty(storyBranch) ? [] : storyBranch.storyRoot
      return roots.length > 1 ? roots[roots.length - 1].replace(/"/g, '') : storyBranchId.replace(/"/g, '')
    }

    return (
      <div className="container-fluid">
        <div className="story-container row">
          <div className="story-container col-lg-6 col-md-6 col-sm-6">
            <h2 className="align-center">{storyBranchId}</h2>
            <div><i>by <Link to={`/allUsers/${this.state.author.id}`}>{(this.state.author.username != '') ? this.state.author.username : 'Anonymous'}</Link></i></div>
            <h4 className="align-center">Root:{' '}<Link to={`/read/${getStoryRootTitle()}`}>"{getStoryRootTitle()}"</Link></h4>
            <div className='giphy-responsive'>
              <iframe src={`${this.state.imageURL}`} width="100%" height="100%" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
            </div>
              {
                !_.isEmpty(storyBranch) && (
                  <div className="start-read">
                    <h4 className="align-center">Start Reading:</h4>
                    <Link to={`/read/${storyBranchId}/${storyBranch.storyCards.shift()}`}><FlatButton label="Branch View" backgroundColor="#50AD55"></FlatButton></Link>
                    &nbsp;
                    <Link to={`/read/full/${storyBranchId}`}><FlatButton label="Full Story View" backgroundColor="#50AD55"></FlatButton></Link>
                  </div>
                )
              }
          </div>

          <div className="start-read col-lg-6 col-md-6 col-sm-6">
            <p></p>
            <ChipInput
              value={this.state.tags}
              fullWidth={true}
              hintText="Add a Tag"
              onRequestAdd={(chip) => this.handleAddTag(chip)}
              onRequestDelete={(chip) => this.handleDeleteTag(chip)}
              />
          </div>
        </div>
        <hr />
        <Reviews storyId={storyBranchId}/>
      </div>
    )
  }
}
