import { handleActions } from 'redux-actions'
import actions from 'actions/playerSearch'

const initialState = {
    results: [],
    count: null,
    next: null,
    previous: null,
    isLoading: false,
    lastUpdated: null
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
        ...state
    }),
    [actions.RECEIVE_NEXT_PAGE_OF_PLAYERS]: (state, action) => ({
        ...state, lastUpdated: action.meta.receivedAt,
        results: [
            ...state.results, ...action.payload.results
        ],
        next: action.payload.next,
        previous: action.payload.previous,
        count: action.payload.count
    })
}, initialState)

export default playerSearch
