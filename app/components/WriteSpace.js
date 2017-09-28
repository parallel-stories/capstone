import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import Navbar from './Navbar'
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 10,
};

class WriteSpace extends Component{
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
        <RaisedButton label="READ"
                      backgroundColor="#D2B48C"
                      style={style}
                      onClick={(e)=>{this.handleLink(e, "read")}} />
      </div>
    )
  }
}

export default WriteSpace
