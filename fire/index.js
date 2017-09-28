const firebase = require('firebase')

// -- // -- // -- // Firebase Config // -- // -- // -- //
var config = {
  apiKey: "AIzaSyCIQseEzcWRIo91HthkEbCCQEDGm9erHKY",
  authDomain: "newagent-c275a.firebaseapp.com",
  databaseURL: "https://newagent-c275a.firebaseio.com",
  projectId: "newagent-c275a",
  storageBucket: "newagent-c275a.appspot.com",
  messagingSenderId: "1036024888547"
};

// -- // -- // -- // -- // -- // -- // -- // -- // -- //

// Initialize the app, but make sure to do it only once.
//   (We need this for the tests. The test runner busts the require
//   cache when in watch mode; this will cause us to evaluate this
//   file multiple times. Without this protection, we would try to
//   initialize the app again, which causes Firebase to throw.
//
//   This is why global state makes a sad panda.)
firebase.__bonesApp || (firebase.__bonesApp = firebase.initializeApp(config))

module.exports = firebase
