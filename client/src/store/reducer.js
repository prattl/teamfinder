import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import fixtures from 'reducers/fixtures'
import playerSearch from 'reducers/playerSearch'

export default combineReducers({
    fixtures,
    playerSearch,
    form: formReducer,
    routing: routerReducer
})
