import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import { GET, PATCH } from 'utils/api'

const actions = keyMirror({
    REQUEST_OWN_PLAYER: null,
    RECEIVE_OWN_PLAYER: null,
    REQUEST_SUBMIT_PROFILE: null,
    RECEIVE_SUBMIT_PROFILE: null,
    DISMISS_CHANGES_SAVED: null
})
export default actions

export const requestOwnPlayer = () => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_OWN_PLAYER)())
    return GET(createUrl('/api/players/me/'), getState().auth.authToken).then(
        response => response.json().then(json => {
            const payload = response.ok ? json : new Error('Error retrieving own player.')
            return dispatch(createAction(actions.RECEIVE_OWN_PLAYER, null, metaGenerator)(payload))
        })
    )
}

export const requestOwnPlayerIfNeeded = () => (dispatch, getState) => {
    const { isLoading, lastUpdated } = getState().player
    if (!isLoading && !lastUpdated) {
        return dispatch(requestOwnPlayer())
    }
}

export const submitProfile = data => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_SUBMIT_PROFILE)())
    const { auth: { authToken }, player: { player: { id } } } = getState()
    if (id && authToken) {
        return PATCH(createUrl(`/api/players/${id}/`), authToken, data).then(
            response => response.json().then(json => {
                const payload = response.ok ? json : new Error('Error submitting profile.')
                dispatch(createAction(actions.RECEIVE_SUBMIT_PROFILE, null, metaGenerator)(payload))
                return ({ response, json })
            })
        )
    }
}

export const dismissChangesSaved = createAction(actions.DISMISS_CHANGES_SAVED)
