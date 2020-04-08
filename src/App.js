import React, { Component } from 'react';
import axios from 'axios';
import { sortBy } from 'lodash'; 
import classNames from 'classnames'; 
import PropTypes from 'prop-types';
import './App.css';

import { DEFAULT_QUERY, DEFAULT_HPP, PATH_BASE,
  PATH_SEARCH, PARAM_SEARCH, PARAM_PAGE,
  PARAM_HPP } from './constants';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'), 
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(), 
};   

// uses local state so is an ES6 class component. The rest are Functional Stateless Components
class App extends Component {
  constructor(props) {
    super(props);
    // set a results object mapping search term (key) with result (value)
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false, 
      sortKey: 'none', 
      isSortReverse: false, 
    };
    // bind class methods to constructor
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this); 
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    // called in componentDidMount() and onSearchSubmit
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this); 
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    // this.onSort = this.onSort.bind(this); 
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
      results: { ...results, [searchKey]: { hits: updatedHits, page } }, isLoading: false,  
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    if (page<0)
    {
      return;  
    }
    this.setState({ isLoading: true }); 

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error })); 
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({
      sortKey, isSortReverse 
    });
  
    // this.setState({ sortKey }); 
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
    const { results, searchKey, } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({ 
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  }
  
  render() {
    const { searchTerm, results, searchKey, error, isLoading, sortKey, isSortReverse } = this.state;
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
        { error?
          <div className='interactions'>
            <p>Something went wrong.</p>
          </div>
          : 
          <Table 
            list = { list }
            onDismiss = { this.onDismiss }
            sortKey = {sortKey}
            onSort = {this.onSort}
            isSortReverse = {isSortReverse}
          />          
        }

        <div className="interactions">
          {/* {
            isLoading?
              <Loading/>
              : 
              <Button onClick = { () => this.fetchSearchTopStories(searchKey, page + 1) }>
                More
              </Button>              
          } */}
          <ButtonWithLoading isLoading = {isLoading} onClick = { () => this.fetchSearchTopStories(searchKey, page + 1 ) }>
            More 
          </ButtonWithLoading>
          {/* <Button onClick = { () => this.fetchSearchTopStories(searchKey, page - 1) }>
            Less
          </Button>             */}
        </div>         
      </div>      
    ); 
  }
} // App

// change Search to a React component
class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }
  render() {
    const { value, onChange, onSubmit, children } = this.props; 
    return (
      <form onSubmit = { onSubmit }>
        <input
          type="text"
          value = { value }
          onChange = { onChange }
          ref = { el => this.input = el }
        />
        <button type="submit">
          { children }
        </button>
      </form>
    )
  }
}

// functional stateless component to React component
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };
    this.onSort=this.onSort.bind(this); 
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey &&
      !this.state.isSortReverse;

    this.setState({ sortKey, isSortReverse });
  }

  render() {
  const { list, onDismiss } = this.props;
  const { sortKey, isSortReverse, } = this.state;
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse
    ? sortedList.reverse()
    : sortedList;
  return (
    <div className='table'>
      <div className='table-row columnHeaders'>
        <span style={{ width: '40%' }}>
          <Sort 
            sortKey={'TITLE'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Title
          </Sort>
        </span>
        <span style={{ width: '20%' }}>
          <Sort 
            sortKey={'AUTHOR'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Author
          </Sort>
        </span>
        <span style={{ width: '14%' }}>
          <Sort
            sortKey={'COMMENTS'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Comments
          </Sort>          
        </span>      
        <span style={{ width: '13%' }}>
          <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Points
            </Sort>    
        </span>      
        <span style={{ width: '13%' }}>
        </span>                              
        </div>
        {reverseSortedList.map(item => 
        <div key = { item.objectID } className='table-row'>
          <span style={{ width: '40%' }}>
            <a href = { item.url }>{ item.title }</a>
          </span>
          <span style = {{ width: '20%' }}>
            { item.author }
          </span>
          <span style = {{ width: '14%' }}>
            { item.num_comments }
          </span>
          <span style = {{ width: '13%' }}>
            { item.points }
          </span>
          <span style = {{ width: '13%' }}>
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
    );
  }
}  


Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number, 
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired, 
}; 

const Sort = ({ sortKey,activeSortKey,onSort,children }) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  );
}

// functional stateless component
const Button = ({ onClick, className, children }) => 
  <button
    onClick = { onClick }
    className = { className }
    type="button"
  >
    { children }
  </button>

Button.defaultProps = {
  className: '',
  };

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired, 
}; 

const Loading = () =>
  <div>Loading...</div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading?
  <Loading/>
  : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button); 
  
export default App;

export {
  Button,
  Search,
  Table,
};