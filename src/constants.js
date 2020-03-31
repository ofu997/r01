const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const sorts = {
  none: list => list,
  title: list => sortBy(list, 'title'), 
  author: list => sortBy(list, 'author'),
  comments: list => sortBy(list, 'num_comments').reverse(),
  points: list => sortBy(list, 'points').reverse(), 
}; 

export { DEFAULT_QUERY, DEFAULT_HPP,
PATH_BASE,
PATH_SEARCH,
PARAM_SEARCH,
PARAM_PAGE,
PARAM_HPP,
sorts,
};