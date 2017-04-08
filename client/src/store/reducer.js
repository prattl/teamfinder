import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import auth from 'reducers/auth'
import fixtures from 'reducers/fixtures'
import player from 'reducers/player'
import playerEvents from 'reducers/playerEvents'
import players from 'reducers/players'
import playerSearch from 'reducers/playerSearch'
import teams from 'reducers/teams'
import teamEvents from 'reducers/teamEvents'
import teamSearch from 'reducers/teamSearch'

export default combineReducers({
    auth,
    fixtures,
    player,
    playerEvents,
    players,
    playerSearch,
    teams,
    teamEvents,
    teamSearch,
    form: formReducer,
    routing: routerReducer
})
