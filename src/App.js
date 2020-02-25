import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ENETDOWN } from 'constants';

// const list = [
//   {
//     title: 'React',
//     url: 'https://reactjs.org/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux',
//     url: 'https://redux.js.org/',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

// uses local state so is an ES6 class component. The rest are Functional Stateless Components
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      // list,
      // searchTerm: '',
      result: null,
      searchTerm: DEFAULT_QUERY,
    };
    // bind a class method to constructor
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }
  // You use the componentDidMount() lifecycle method to fetch the data after the component
  // mounted. The first fetch uses default search term from the local state. It will fetch “redux” related
  // stories, because that is the default parameter.
  componentDidMount() {
    const { searchTerm } = this.state; 
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }
  
  // arrow function would auto bind the function
  onDismiss(id) {
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  }
  
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }
  
  render() {
    const { searchTerm, result } = this.state;
    if (!result) { return null }  
    return (
      <p></p>
      ); 
  }
}
    
// Example of composable component
// class Search extends Component {
//   render() {
//     // children is the word "Search" between opening and closing tags
//     const { value, onChange, children } = this.props;
//     return (
//       <form>
//         { children } 
//         <input   
//           type = "text"
//           value = { value }
//           onChange = { onChange }
//         />
//       </form>
//     )
//   }
// }
      
//  Functional Stateless Component. Stage 1
// function Search(props) {
//   const { value, onChange, children } = props;
//   return (
//     <form>
//       {children} 
//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//       />
//     </form>
//   )
// }
    
//  Stage 2
// function Search( { value, onChange, children } ) {
//   return (
//     <form>
//       {children} 
//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//       />
//     </form>
//   )
// }

// Stage 3
const Search = ( { value, onChange, children } ) =>
  <form>
    {children} 
    <input
      type="text"
      value={value}
      onChange={onChange}
      />
  </form>

// class Table extends Component {
//   render() {
//     const { list, pattern, onDismiss } = this.props;
//     return(
//       <div>
//         {list.filter(isSearched(pattern)).map(item =>
//           <div key = { item.objectID }>
//             <span><a href = { item.url }>{item.title}</a></span>
//             <span>{ item.author }</span>
//             <span>{ item.num_comments }</span>
//             <span>{ item.points }</span>
//             <span>
//               <Button
//                 onClick={() => onDismiss(item.objectID)}
//               >
//                 Dismiss
//               </Button>
//             </span>
//           </div>
//         )}
//       </div>
//     )
//   }
// }

// As a functional stateless component
  const Table = ({ list, pattern, onDismiss }) =>  
  <div className='table'>
    {list.filter(isSearched(pattern)).map(item =>
    <div key = { item.objectID } className='table-row'>
      <span style={{ width: '40%' }}>
        <a href = { item.url }>{item.title}</a>
      </span>
      <span style={{ width: '30%' }}>
        { item.author }
      </span>
      <span style={{ width: '10%' }}>
        { item.num_comments }
      </span>
      <span style={{ width: '10%' }}>
        { item.points }
      </span>
      <span style={{ width: '10%' }}>
        <Button
          className='button-inline'
          onClick={() => onDismiss(item.objectID)}
          >
          Dismiss
        </Button>
      </span>
    </div>
    )}
  </div>



// example of reusable component
// class Button extends Component {
//   render() {
//     const { 
//       onClick, 
//       className = "", 
//       children,
//     } = this.props;
//     return (
//       <button
//       onClick = { onClick }
//       className = { className }
//       type="button"
//       >
//       { children }
//       </button>
//     );
//   }
// }
        
// As a functional stateless component
const Button = ({ onClick, className, children}) => 
  <button
  onClick = { onClick }
  className = { className }
  type="button"
  >
  { children }
  </button>

export default App;