import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ENETDOWN } from 'constants';

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
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: { ...this.state.result, hits: updatedHits }
    });
  }
  
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }
  
  render() {
    const { searchTerm, result } = this.state;
    // if (!result) { return null }  
    return (
      <div className='page'>
        <div className='interactions'>
          <Search 
            value = { searchTerm }
            onChange = { this.onSearchChange }
          >
            Search 
          </Search>
          { result ? 
            <Table 
              list = { result.hits }
              pattern = { searchTerm }
              onDismiss = { this.onDismiss }
            />
            : null
          }
        </div>
      </div>      
    ); 
  }
}
    
// functional stateless component
const Search = ( { value, onChange, children } ) =>
  <form>
    {children} 
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>

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

// functional stateless component
const Button = ({ onClick, className, children}) => 
  <button
  onClick = { onClick }
  className = { className }
  type="button"
  >
  { children }
  </button>

export default App;