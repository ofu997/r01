import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

// uses local state so is an ES6 class component. The rest are Functional Stateless Components
class App extends Component {
  constructor(props) {
    super(props);
    // set a results object mapping search term (key) with result (value)
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
    };
    // bind class methods to constructor
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this); 
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    // called in componentDidMount() and onSearchSubmit
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this); 
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]?
      results[searchKey].hits
      : []; 

    const updatedHits = [...oldHits, ...hits];

    this.setState({ 
      results: { ...results, [searchKey]: { hits: updatedHits, page } } 
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error); 
  }

  // (1st tip) You use the componentDidMount() lifecycle method to fetch the data after the component
  // mounted. The first fetch uses default search term from the local state. It will fetch “redux” related
  // stories, because that is the default parameter.
  // (2nd tip) It is only called on the client, meaning usually performed after the initial render when the client 
  // has received data from server and right before this data paints the browser. It allows you to do all kinds of 
  // advanced interactions like state changes. 

  componentDidMount() {
    const { searchTerm } = this.state; 
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  // reactjs.org: setState() does not always immediately update the component. It may batch 
  // or defer the update until later. This makes reading this.state right after 
  // calling setState() a potential pitfall. Instead, use componentDidUpdate or 
  // a setState callback (setState(updater, callback)), either of which are 
  // guaranteed to fire after the update has been applied.

  // Allows us to change 'redux' value passed into search box
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state; 
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  // arrow function would auto bind the function
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({ 
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  }
  
  render() {
    const { searchTerm, results, searchKey } = this.state;
    const page = ( results && results[searchKey] && results[searchKey].page ) || 0;
    const list = ( results && results[searchKey] && results[searchKey].hits ) || [];
    return (
      <div className='page'>
        <div className='interactions'>
          <Search 
            value = { searchTerm }
            onChange = { this.onSearchChange }
            onSubmit = { this.onSearchSubmit }
          >
            Search 
          </Search>
        </div>
        <Table 
          list = { list }
          onDismiss = { this.onDismiss }
        />

        <div className="interactions">
          <Button onClick = { () => this.fetchSearchTopStories(searchKey, page + 1) }>
            More
          </Button>
          <Button onClick = { () => this.fetchSearchTopStories(searchKey, page - 1) }>
            Less
          </Button>            
        </div>         
      </div>      
    ); 
  }
}
    
// functional stateless component
const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit = { onSubmit }>
    <input
      type="text"
      value = { value }
      onChange = { onChange }
    />
    <button type="submit">
      { children }
    </button>
  </form>

// As a functional stateless component
  const Table = ({ list, onDismiss }) =>  
  <div className='table'>
    <div className='table-row columnHeaders'>
      <span style={{ width: '40%' }}>
        <p>Article</p>
      </span>
      <span style={{ width: '30%' }}>
        <p>Author</p>
      </span>
      <span style={{ width: '10%' }}>
        <p>Comments</p>
      </span>      
      <span style={{ width: '10%' }}>
        <p>Points</p>
      </span>      
      <span style={{ width: '10%' }}>
      </span>                              
    </div>
    { list.map(item =>
    <div key = { item.objectID } className='table-row'>
      <span style={{ width: '40%' }}>
        <a href = { item.url }>{ item.title }</a>
      </span>
      <span style = {{ width: '30%' }}>
        { item.author }
      </span>
      <span style = {{ width: '10%' }}>
        { item.num_comments }
      </span>
      <span style = {{ width: '10%' }}>
        { item.points }
      </span>
      <span style = {{ width: '10%' }}>
        <Button
          onClick = { () => onDismiss(item.objectID) }
          className='button-inline'
        >
          Dismiss
        </Button>
      </span>
    </div>
    )}
  </div>

// functional stateless component
const Button = ({ onClick, className = '', children}) => 
  <button
    onClick = { onClick }
    className = { className }
    type="button"
  >
    { children }
  </button>

export default App;