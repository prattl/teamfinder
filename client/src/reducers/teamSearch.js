import { handleActions } from 'redux-actions'
import actions from 'actions/teamSearch'

const initialState = {
    results: [],
    count: null,
    next: null,
    previous: null,
    isLoading: false,
    nextPageLoading: false,
    lastUpdated: null,
    
}

const teamSearch = handleActions({
    [actions.REQUEST_TEAM_SEARCH]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_TEAM_SEARCH]: (state, action) => ({
        ...state, isLoading: false, lastUpdated: action.meta.receivedAt,
        ...action.payload
    }),
    [actions.REQUEST_NEXT_PAGE_OF_TEAMS]: (state, action) => ({
        ...state, nextPageLoading: true
    }),
    [actions.RECEIVE_NEXT_PAGE_OF_TEAMS]: (state, action) => ({
        ...state, nextPageLoading: false, lastUpdated: action.meta.receivedAt,
        results: [
            ...state.results, ...action.payload.results
        ],
        next: action.payload.next,
        previous: action.payload.previous,
        count: action.payload.count
    }),
    // TODO: Remove below: handled by teams reducer
    // [actions.REQUEST_TEAM]: (state, action) => ({
    //     ...state, teamIsLoading: true
    // }),
    // [actions.RECEIVE_TEAM]: (state, action) => ({
    //     ...state, teamIsLoading: false, teamLastUpdated: action.meta.receivedAt,
    //     team: action.error ? state.team : action.payload,
    //     error: action.error ? action.payload : null
    // })
}, initialState)

export default teamSearch
