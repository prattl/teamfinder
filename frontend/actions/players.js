import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { browserHistory } from 'react-router'

import api from 'api/api'
import { metaGenerator } from 'utils'

const actions = keyMirror({
    REQUEST_PLAYERS: null,
    RECEIVE_PLAYERS: null
})
export default actions

export const requestPlayers = values => {
    return (dispatch, getState) => {
        console.log('requestPlayers got', values)
        dispatch(createAction(actions.REQUEST_PLAYERS)())
        return api.get2('/api/players/', getState().auth.authToken).then(
            ({json, response}) => {
                const payload = response.ok ? { results: json } : new Error(json.detail)
                return dispatch(createAction(actions.RECEIVE_PLAYERS, p => p, metaGenerator)(payload))
            }
        )
    }
}
