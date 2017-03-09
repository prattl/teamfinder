import { handleActions } from 'redux-actions'
import actions from 'actions/player'
import { actionTypes as reduxFormActions } from 'redux-form'

const initialState = {
    player: {
        teams: []
    },
    changesSaved: false,
    isLoading: false,
    lastUpdated: null
}

const player = handleActions({
    [actions.REQUEST_OWN_PLAYER]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_OWN_PLAYER]: (state, action) => ({
        ...state,
        player: action.payload,
        isLoading: false, lastUpdated: action.meta.receivedAt
    }),
    [actions.RECEIVE_SUBMIT_PROFILE]: (state, action) => ({
        ...state,
        player: action.error ? state.player : action.payload
    }),
    [reduxFormActions.SET_SUBMIT_SUCCEEDED]: (state, action) => ({
        ...state, changesSaved: action.meta.form === 'profile'
    }),
    [reduxFormActions.CHANGE]: (state, action) => ({
        ...state, changesSaved: action.meta.form === 'profile' ? false : state.changesSaved
    }),
    [actions.DISMISS_CHANGES_SAVED]: (state, action) => ({
        ...state, changesSaved: false
    })
}, initialState)

export default player
