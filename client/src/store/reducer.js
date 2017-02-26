import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import auth from 'reducers/auth'
import fixtures from 'reducers/fixtures'
import playerSearch from 'reducers/playerSearch'
import teams from 'reducers/teams'

export default combineReducers({
    auth,
    fixtures,
    playerSearch,
    teams,
    form: formReducer,
    routing: routerReducer
})
