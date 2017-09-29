import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import RaisedButton from 'material-ui/RaisedButton'

const style = {
  margin: 10,
}

class WriteSpace extends Component {
  constructor(props) {
    super(props)
    this.state = { text: '' } // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(value) {
    this.setState({ text: value })
  }

  render() {
    return (
      <div>
        <ReactQuill value={this.state.text}
                    onChange={this.handleChange}
                    className="container container-fluid"/>
        <div className="row">
          <div className="col col-4 col-lg-4 col-md-4 col-sm-4">
            <RaisedButton label="READ"
                      backgroundColor="#D2B48C"
                      style={style}
                      onClick={() => console.log('SUBMIT STORY')} />
          </div>
        </div>
      </div>
    )
  }
}

export default WriteSpace
