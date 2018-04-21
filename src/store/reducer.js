import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import games from './games/';
import players from './players/';

export default combineReducers({
  routing: routerReducer,
  games,
  players,
});
