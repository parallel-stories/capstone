import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import Navbar from './Navbar'

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
        <Navbar />
        <ReactQuill value={this.state.text}
                    onChange={this.handleChange}
                    className="container container-fluid"/>
      </div>
    )
  }
}

export default WriteSpace
