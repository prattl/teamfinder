import { handleActions } from 'redux-actions'
import actions from 'actions/playerSearch'

const initialState = {
    results: [],
    count: null,
    next: null,
    previous: null,
    isLoading: false,
    nextPageLoading: false,
    lastUpdated: null,

    // TODO: This part should probably be moved into its own reducer
    player: {},
    playerIsLoading: false,
    playerLastUpdated: null,
    error: null,

    confirmInvitation: {
        playerId: null,
        teamId: null
    }
}

const playerSearch = handleActions({
    [actions.REQUEST_PLAYER_SEARCH]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_PLAYER_SEARCH]: (state, action) => ({
        ...state, isLoading: false, lastUpdated: action.meta.receivedAt,
        ...action.payload
    }),
    [actions.REQUEST_NEXT_PAGE_OF_PLAYERS]: (state, action) => ({
        ...state, nextPageLoading: true
    }),
    [actions.RECEIVE_NEXT_PAGE_OF_PLAYERS]: (state, action) => ({
        ...state, nextPageLoading: false, lastUpdated: action.meta.receivedAt,
        results: [
            ...state.results, ...action.payload.results
        ],
        next: action.payload.next,
        previous: action.payload.previous,
        count: action.payload.count
    }),

    [actions.REQUEST_PLAYER]: (state, action) => ({
        ...state, playerIsLoading: true
    }),
    [actions.RECEIVE_PLAYER]: (state, action) => ({
        ...state, playerIsLoading: false, playerLastUpdated: action.meta.receivedAt,
        player: action.error ? state.player : action.payload,
        error: action.error ? action.payload : null
    }),
    [actions.CONFIRM_INVITE_TO_TEAM]: (state, action) => ({
        ...state,
        confirmInvitation: {
            ...state.confirmInvitation, ...action.payload
        }
    }),
    [actions.CANCEL_INVITE_TO_TEAM]: (state, action) => ({
        ...state,
        confirmInvitation: {
            ...state.confirmInvitation, playerId: null, teamId: null
        }
    })
}, initialState)

export default playerSearch
