// Services
import { addPlayerToGame, updatePlayer } from './../../services/firebase';

// Helpers
import { checkObjEmpty } from './../../utilities/helpers';
import { saveState } from './../../utilities/localstorage';

// Actions
const ADD_PLAYER_REQUEST = 'app/games/ADD_PLAYER_REQUEST';
const ADD_PLAYER_SUCCESS = 'app/games/ADD_PLAYER_SUCCESS';
const ADD_PLAYER_FAILURE = 'app/games/ADD_PLAYER_FAILURE';
const UPDATE_PLAYER_REQUEST = 'app/games/UPDATE_PLAYER_REQUEST';
const UPDATE_PLAYER_SUCCESS = 'app/games/UPDATE_PLAYER_SUCCESS';
const UPDATE_PLAYER_FAILURE = 'app/games/UPDATE_PLAYER_FAILURE';

const initialState = {
  allPlayers: [],
  currentPlayer: '',
  lastFetched: null,
  isFetching: false,
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PLAYER_REQUEST:
      return Object.assign({}, state, {
        isReady: false,
        errorMessage: '',
      });
    case ADD_PLAYER_SUCCESS:
      return Object.assign({}, state, {
        isReady: true,
        apiError: false,
        currentPlayer: action.playerId,
      });
    case ADD_PLAYER_FAILURE:
      return Object.assign({}, state, {
        isReady: false,
        apiError: true,
      });
    case UPDATE_PLAYER_REQUEST:
      return Object.assign({}, state, {
        isReady: false,
        errorMessage: '',
      });
    case UPDATE_PLAYER_SUCCESS:
      return Object.assign({}, state, {
        isReady: true,
        apiError: false,
      });
    case UPDATE_PLAYER_FAILURE:
      return Object.assign({}, state, {
        isReady: false,
        apiError: true,
      });
    default:
      return state;
  }
}

// Action Creators
export function addPlayerRequest(playerData) {
  return { type: ADD_PLAYER_REQUEST, playerData };
}

export function addPlayerSuccess(playerId) {
  return { type: ADD_PLAYER_SUCCESS, playerId };
}

export function addPlayerFailure(error) {
  return { type: ADD_PLAYER_FAILURE, error };
}

export function updatePlayerRequest(playerData) {
  return { type: UPDATE_PLAYER_REQUEST, playerData };
}

export function updatePlayerSuccess() {
  return { type: UPDATE_PLAYER_SUCCESS };
}

export function updatePlayerFailure(error) {
  return { type: UPDATE_PLAYER_FAILURE, error };
}

// Add player thunk
export function addPlayer(gameCode, playerData) {
  return dispatch => {
    dispatch(addPlayerRequest(playerData));
    return addPlayerToGame(gameCode, playerData)
      .then(response => {
        // Persist current game to localstore
        saveState({
          id: response.key,
          currentGame: gameCode,
          playerName: playerData.name,
        });
        return dispatch(addPlayerSuccess(response.key));
      })
      .catch(error => {
        dispatch(addPlayerFailure(error));
        throw error;
      });
  };
}

// Add player data thunk
export function updatePlayerData(gameCode, playerId, playerData) {
  return dispatch => {
    dispatch(updatePlayerRequest(gameCode, playerId, playerData));
    return updatePlayer(gameCode, playerId, playerData)
      .then(() => dispatch(updatePlayerSuccess()))
      .catch(error => {
        dispatch(updatePlayerFailure(error));
        throw error;
      });
  };
}

// Selectors
export function playerDataLoaded(state) {
  return state.currentPlayer !== '';
}

export function currentPlayer(game, playerId) {
  return game.players && game.players[playerId];
}
