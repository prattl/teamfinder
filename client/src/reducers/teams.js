import { handleActions } from 'redux-actions'
import actions from 'actions/teams'

// part of redux
// function that takes a state (giant obj) and an action -> state
const initialTeamState = {
    team: null,
    isLoading: false,
    lastUpdated: null,
    confirmDelete: false,
    confirmDeleteTeamMember: null,
    deleteTeamMemberError: null,
    confirmPromoteToCaptain: null,
    confirmPromoteToCaptainError: null
}

// no need for error checking (teams will never be undefined)
const initialState = {
    teams: {},
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
    }),
    [actions.RECEIVE_DELETE_TEAM]: (state, action) => {
        const { [action.payload]: _, ...newTeams} = state.teams
        return {
            ...state,
            teams: newTeams
        }
    },
    [actions.CONFIRM_DELETE_TEAM]: (state, action) => ({
        ...state,
        teams: {
            ...state.teams,
            [action.payload]: {
                ...state.teams[action.payload],
                confirmDelete: true
            }
        }
    }),
    [actions.CANCEL_DELETE_TEAM]: (state, action) => ({
        ...state,
        teams: {
            ...state.teams,
            [action.payload]: {
                ...state.teams[action.payload],
                confirmDelete: false
            }
        }
    }),
    [actions.CONFIRM_DELETE_TEAM_MEMBER]: (state, action) => ({
        ...state,
        teams: {
            ...state.teams,
            [action.payload.teamId]: {
                ...state.teams[action.payload.teamId],
                confirmDeleteTeamMember: action.payload.teamMemberId
            }
        }
    }),
    [actions.CANCEL_DELETE_TEAM_MEMBER]: (state, action) => ({
        ...state,
        teams: {
            ...state.teams,
            [action.payload.teamId]: {
                ...state.teams[action.payload.teamId],
                confirmDeleteTeamMember: null
            }
        }
    }),
    [actions.RECEIVE_DELETE_TEAM_MEMBER]: (state, action) => {
        const updatedTeamMembers = state.teams[action.meta.teamId].team.team_members.filter(teamMember => (
            teamMember.id !== action.meta.teamMemberId
        ))
        return {
            ...state,
            teams: {
                ...state.teams,
                [action.meta.teamId]: {
                    ...state.teams[action.meta.teamId],
                    deleteTeamMemberError: action.error ? action.payload.message : null,
                    team: action.error ? state.teams[action.meta.teamId].team : {
                        ...state.teams[action.meta.teamId].team,
                        team_members: updatedTeamMembers
                    }
                }
            }
        }
    },
    [actions.CONFIRM_PROMOTE_TO_CAPTAIN]: (state, action) => ({
        ...state,
        teams: {
            ...state.teams,
            [action.payload.teamId]: {
                ...state.teams[action.payload.teamId],
                confirmPromoteToCaptain: action.payload.teamMemberId
            }
        }
    }),
    [actions.CANCEL_PROMOTE_TO_CAPTAIN]: (state, action) => ({
        ...state,
        teams: {
            ...state.teams,
            [action.payload.teamId]: {
                ...state.teams[action.payload.teamId],
                confirmPromoteToCaptain: null
            }
        }
    }),
    [actions.RECEIVE_PROMOTE_TO_CAPTAIN]: (state, action) => {
        return {
            ...state,
            teams: {
                ...state.teams,
                [action.meta.teamId]: {
                    ...state.teams[action.meta.teamId],
                    team: action.error ? state.teams[action.meta.teamId].team : action.payload,
                    confirmPromoteToCaptain: action.error ? state.teams[action.meta.teamId].confirmPromoteToCaptain : null,
                    confirmPromoteToCaptainError: action.error ? action.payload.message : null
                }
            }
        }
    }
}, initialState)

export default teams
