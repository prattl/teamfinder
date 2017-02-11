import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import fixtures from 'reducers/fixtures'

export default combineReducers({
    fixtures,
    form: formReducer,
    routing: routerReducer
})
