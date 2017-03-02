import { handleActions } from 'redux-actions'
import actions from 'actions/player'

const initialState = {
    player: null,
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
    })
}, initialState)

export default player
