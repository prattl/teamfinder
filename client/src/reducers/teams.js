import { handleActions } from 'redux-actions'
import actions from 'actions/teams'

// part of redux
// function that takes a state (giant obj) and an action -> state
const initialTeamState = {
    team: {},
    isLoading: false,
    lastUpdated: null
}

// no need for error checking (teams will never be undefined)
const initialState = {
    teams: {}
}

// TODO : reduxjs guide
const teams = handleActions({
    // brackets : like a constant
    [actions.REQUEST_TEAM]: (state, action) => ({
        // ... : copy state to new object called state
        // allows you to jump back and forth in redux
        ...state,
        teams: {
            ...state.teams,
            [action.payload]: (Object.keys(state.teams).includes(action.payload)) ? state.teams[action.payload] : ({
                ...initialTeamState, isLoading: true
            })
        }
    }),
    [actions.RECEIVE_TEAM]: (state, action) => ({
        ...state,
        teams: {
            ...state.teams,
            [action.payload.id]: {
                ...state.teams[action.payload.id],
                team: action.payload.result,
                isLoading: false,
                lastUpdated: action.meta.receivedAt
            }
        }
    })
}, initialState)

export default teams
