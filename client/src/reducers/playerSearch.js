import { handleActions } from "redux-actions";
import actions from "actions/playerSearch";
import { actionTypes as reduxFormActions } from "redux-form";

const initialState = {
  results: [],
  count: null,
  next: null,
  previous: null,
  isLoading: false,
  nextPageLoading: false,
  lastUpdated: null,

  confirmInvitation: {
    playerId: null,
    teamId: null
  }
};

const playerSearch = handleActions(
  {
    [actions.REQUEST_PLAYER_SEARCH]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [actions.RECEIVE_PLAYER_SEARCH]: (state, action) => ({
      ...state,
      isLoading: false,
      lastUpdated: action.meta.receivedAt,
      ...action.payload
    }),
    [actions.REQUEST_NEXT_PAGE_OF_PLAYERS]: (state, action) => ({
      ...state,
      nextPageLoading: true
    }),
    [actions.RECEIVE_NEXT_PAGE_OF_PLAYERS]: (state, action) => ({
      ...state,
      nextPageLoading: false,
      lastUpdated: action.meta.receivedAt,
      results: [...state.results, ...action.payload.results],
      next: action.payload.next,
      previous: action.payload.previous,
      count: action.payload.count
    }),

    [actions.REQUEST_PLAYER]: (state, action) => ({
      ...state,
      playerIsLoading: true
    }),
    [actions.RECEIVE_PLAYER]: (state, action) => ({
      ...state,
      playerIsLoading: false,
      playerLastUpdated: action.meta.receivedAt,
      player: action.error ? state.player : action.payload,
      error: action.error ? action.payload : null
    }),
    [actions.CONFIRM_INVITE_TO_TEAM]: (state, action) => ({
      ...state,
      confirmInvitation: {
        ...state.confirmInvitation,
        ...action.payload
      }
    }),
    [actions.CANCEL_INVITE_TO_TEAM]: (state, action) => ({
      ...state,
      confirmInvitation: {
        ...state.confirmInvitation,
        playerId: null,
        teamId: null
      }
    }),
    [reduxFormActions.SET_SUBMIT_SUCCEEDED]: (state, action) => ({
      ...state,
      confirmInvitation: {
        playerId:
          action.meta.form === "invitation"
            ? null
            : state.confirmInvitation.playerId,
        teamId:
          action.meta.form === "invitation"
            ? null
            : state.confirmInvitation.teamId
      }
    })
  },
  initialState
);

export default playerSearch;
