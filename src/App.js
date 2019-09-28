import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ENETDOWN } from 'constants';

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

const helloWorld = 'Welcome to my React site';

// function isSearched(searchTerm) {
//   return function (item) {
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      list,
      searchTerm: '',
    };
    // bind a class method to constructor
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  // arrow function would auto bind the function
  onDismiss(id) {
    // function isNotId(item) {
    //   return item.objectID !== id;
    // }
    // const isNotId = item => item.objectID !== id;

    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, list } = this.state;
    return (
      // <div className="App">
      //   <form>
      //     <input 
      //       type="text" 
      //       value = { searchTerm }
      //       onChange = {this.onSearchChange}
      //     />
      //   </form>
      //   {list.filter(isSearched(searchTerm)).map(item => 
      //     <div key = { item.objectID } >
      //       <span>
      //         <a href={item.url}>{item.title}</a>
      //       </span>
      //       <span>
      //         {item.author}&nbsp;
      //       </span>
      //       <span>
      //         comments: {item.num_comments}&nbsp;
      //       </span>
      //       <span>
      //         points: {item.points}
      //       </span>
      //       <span>
      //         <button
      //         onClick={() => this.onDismiss(item.objectID)}
      //         type="button"
      //         >
      //         Dismiss
      //         </button>
      //       </span>
      //     </div>
      //   )}
      // </div> //for class App

      // Split App into components
      <div className="App">
        <Search 
          value = {searchTerm}
          onChange = {this.onSearchChange}
        />
        <Table 
          list = {list}
          pattern = {searchTerm}
          onDismiss = {this.onDismiss}
        />
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const { value, onChange} = this.props;
    return (
      <form>
        <input 
          type = "text"
          value = {value}
          onChange = {onChange}
        />
      </form>
    )
  }
}

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;
    return(
      <div>
        {list.filter(isSearched(pattern)).map(item =>
          <div key={item.objectID}>
            <span>
            <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
            <button
            onClick={() => onDismiss(item.objectID)}
            type="button"
            >
            Dismiss
            </button>
            </span>
          </div>
        )}
      </div>
    )
  }
}

export default App;