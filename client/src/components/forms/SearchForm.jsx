import { requestPlayerSearch } from 'actions/playerSearch'
import { requestTeamSearch } from 'actions/teamSearch'

export const playerSubmit = (values, dispatch) => {
    console.log('playerSubmit', values)
    return dispatch(requestPlayerSearch(values)).then(result => console.log('result', result))
}

export const teamSubmit = (values, dispatch) => {
    console.log('teamSubmit', values)
    // dispatch:
    return dispatch(requestTeamSearch(values)).then(result => console.log('result', result))
}
