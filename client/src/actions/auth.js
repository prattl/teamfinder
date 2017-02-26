import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import { fetchGET } from 'actions/playerSearch'

const actions = keyMirror({
    REQUEST_AUTH_STATUS: null,
    RECEIVE_AUTH_STATUS: null
})
export default actions

export const requestAuthStatus = () => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_AUTH_STATUS)())
    return fetchGET(createUrl('/api/auth/me/')).then(response => response.json().then(json => {
        console.log('Got json', json)
        const payload = response.ok ? json : new Error('Error retrieving auth status')
        return dispatch(createAction(actions.RECEIVE_AUTH_STATUS, null, metaGenerator)(payload))
    }))
}
