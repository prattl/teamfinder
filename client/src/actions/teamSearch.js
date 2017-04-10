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
    const { keywords, regions, positions, skill_bracket } = values
    let url = createUrl(`/api/teams/?keywords=${keywords}&skill_bracket=${skill_bracket}`)
    regions.forEach(region => url += `&regions[]=${region}`)
    positions.forEach(position => url += `&positions[]=${position}`)
    return GET(url).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving teams search results.')
        dispatch(createAction(actions.RECEIVE_TEAM_SEARCH, null, metaGenerator)(payload))
        if (!response.ok) {
            return Promise.reject(json)
        }
        return json
    }))
}

export const requestTeam = id => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_TEAM)())
    const { results } = getState().teamSearch
    const team = results.find(result => result.id === id)
    if (team) {
        return dispatch(createAction(actions.RECEIVE_TEAM, null, metaGenerator)(team))
    } else {
        const url = createUrl(`/api/teams/${id}/`)
        return GET(url).then(response => response.json().then(json => {
            // TODO: Implement NotFoundError
            const payload = response.ok ? json : new Error('Error retrieving team.')
            return dispatch(createAction(actions.RECEIVE_TEAM, null, metaGenerator)(payload))
        }))
    }
}

export const requestNextPageOfTeams = () => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_NEXT_PAGE_OF_TEAMS)())
    const nextPage = getState().teamSearch.next
    return GET(nextPage).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving next page of team search results.')
        dispatch(createAction(actions.RECEIVE_NEXT_PAGE_OF_TEAMS, null, metaGenerator)(payload))
        if (!response.ok) {
            return Promise.reject(json)
        }
        return json
    }))
}
