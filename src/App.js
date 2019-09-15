import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

class App extends Component {
  render() {
    const helloWorld = 'Welcome to my React site';
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <div style={{padding : "100px 0px"}}>
          {list.map(function(item) {
            return (
              <div key = { item.objectID } >
                <span>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span>
                  {item.author}&nbsp;
                </span>
                <span>
                  comments: {item.num_comments}&nbsp;
                </span>
                <span>
                  points: {item.points}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    );
  }
}

export default App;