import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import fetch from 'isomorphic-fetch'

const actions = keyMirror({
    REQUEST_PLAYER_SEARCH: null,
    RECEIVE_PLAYER_SEARCH: null
})
export default actions

export const requestPlayerSearch = keywords => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_PLAYER_SEARCH)())
    return fetch(createUrl('/api/players/'), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(response => response.json().then(json => {
        console.log('requestPlayerSearch got json', json)
        const payload = response.ok ? json : new Error('Error retrieving player search results.')
        return dispatch(createAction(actions.RECEIVE_PLAYER_SEARCH, null, metaGenerator)(payload))
    }))
}
