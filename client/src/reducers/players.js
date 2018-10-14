import { handleActions } from "redux-actions";
import actions from "actions/playerSearch";
import { arrayToObject } from "utils";

const initialState = {
  players: {},
  isLoading: false,
  lastUpdated: null
};

const players = handleActions(
  {
    [actions.REQUEST_PLAYER]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [actions.RECEIVE_PLAYER]: (state, action) => ({
      ...state,
      isLoading: false,
      lastUpdated: action.meta.receivedAt,
      players: {
        ...state.players,
        [action.payload.id]: action.payload
      }
    }),
    [actions.RECEIVE_PLAYER_SEARCH]: (state, action) => ({
      ...state,
      players: {
        ...state.players,
        ...arrayToObject(action.payload.results)
      }
    })
  },
  initialState
);

export default players;
