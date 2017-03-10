import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import { GET } from 'utils/api'

const actions = keyMirror({
    REQUEST_TEAM_SEARCH: null,
    RECEIVE_TEAM_SEARCH: null,
    REQUEST_TEAM: null,
    RECEIVE_TEAM: null,
    REQUEST_NEXT_PAGE_OF_TEAMS: null,
    RECEIVE_NEXT_PAGE_OF_TEAMS: null
})

export default actions

export const requestTeamSearch = (values) => (dispatch, getStates) => {
    dispatch(createAction(actions.REQUEST_TEAM_SEARCH)())
    const { keywords, regions } = values
    let url = createUrl(`/api/teams/?keywords=${keywords}`)
    regions.forEach(region => url += `&regions[]=${region}`)
    return GET(url).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving teams search results.')
        dispatch(createAction(actions.RECEIVE_TEAM_SEARCH, null, metaGenerator)(payload))
        if (!response.ok) {
            return Promise.reject(json)
        }
        return json
    }))
}