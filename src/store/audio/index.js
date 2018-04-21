import { play, stop } from './../../utilities/speech';

// Actions
const QUEUE_MESSAGE = 'app/audio/QUEUE_MESSAGE';
const CLEAR_QUEUE = 'app/audio/CLEAR_QUEUE';

const initialState = {
  lastAction: false,
};

// Reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case QUEUE_MESSAGE:
      return Object.assign({}, state, {
        isReady: false,
        lastAction: 'QUEUE_MESSAGE',
      });
    case CLEAR_QUEUE:
      return Object.assign({}, state, {
        lastAction: 'CLEAR_QUEUE',
      });
    default:
      return state;
  }
}

// Action Creators
export function queueMessage(message) {
  return { type: QUEUE_MESSAGE, message };
}

export function clearQueue() {
  return { type: CLEAR_QUEUE };
}

// Thunks
export function speak(message) {
  return dispatch => {
    play(message);
    dispatch(queueMessage(message));
  };
}
