import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

// react components
import Navbar from './Navbar'

const style = {
  margin: 12,
  color: 'rgb(255, 255, 255)'
};

const LandingPage = (props) => {
  return (
    <div className="container container-fluid landing-text">
      <Navbar/>
      <div className="row">
        <br/>
        <br/>
        <img src="http://placekitten.com/200/200" alt="logo depicting a book"/>
        <h1>
          Welcome to <span className="title">Parallel Stories</span>!
        </h1>
        <p>
          Some Lorem Ipsum here etc.....
        </p>
      </div>
      <br />
      <div className="row">
        <div className="col col-4 col-lg-4 col-md-4 col-sm-4">
          <RaisedButton
            label="BUTTON 1"
            backgroundColor="#37474F"
            style={style}
          />
        </div>
        <div className="col col-4 col-lg-4 col-md-4 col-sm-4">
          <RaisedButton
            label="BUTTON 2"
            backgroundColor="#37474F"
            style={style}
          />
        </div>
        <div className="col col-4 col-lg-4 col-md-4 col-sm-4">
          <RaisedButton
            label="BUTTON 3"
            backgroundColor="#37474F"
            style={style}
          />
        </div>
      </div>
    </div>
  );
};


export default LandingPage;
