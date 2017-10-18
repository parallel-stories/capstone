# Parallel Stories

Parallel Stories allows you to read and write stories with the feature to create alternate or parallel storylines. Lay the foundation for the roots of a story or contribute to existing story trees. Don’t hold back in integrating your personal experiences or wild imagination with Parallel Stories!

Version: 1.0.0

## Deployed Link
Check out the app at [https://parallel-stories.com/](https://parallel-stories.com/).

## Built With
Based off *firebones* from https://github.com/queerviolet/firebones<br />
[React.js](https://reactjs.org/)<br />
[Firebase](https://firebase.google.com/)<br />
[Material-UI](http://www.material-ui.com/#/)<br />
[Quill.js](https://github.com/quilljs/quill)<br />
[react-tree-graph](https://github.com/jpb12/react-tree-graph)<br />
[react-html-parser](https://github.com/wrakky/react-html-parser)<br />

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing
Install all dependencies after forking to your local machine:
```
yarn install
// OR
npm install
```
Use your own firebase database by replacing config information in /fire/index.js:
```
var config = {
  apiKey: /* You apiKey here */,
  authDomain: /* You authDomain here */,
  databaseURL: /* You database URL here */,
  projectId: /* You projectId here */,
  storageBucket: /* You storageBucket here */,
  messagingSenderId: /* You messagingSenderId here */
}
```
Seed your database with provided seed file database_seed.json by importing into your firebase database data.

Run development environment:
```
// Method 1:
npm run build-watch
npm start

// Method 2:
npm run build-dev
```
Go to localhost:5000 in browser to see web application running.

## Testing

Test componenets and firebase calls once:
```
npm run test
```

Watch and run tests:
```
npm run test-watch
```

## Contributing
Please read the [Contribution Guide](https://github.com/parallel-stories/capstone/blob/readme-%2346/CONTRIBUTION_GUIDE.md) for details on our code of conduct and process for issues and pull requests.

## Authors
- [Chuen Yan (Jamie) Lau](https://github.com/cylau1031)
- [Jennifer Joo](https://github.com/Corvids)
- [Rasprit Kaur](https://github.com/rkaur01)
- [Mieka Page](https://github.com/miekapage)

## License
This project is licensed under the MIT license.
