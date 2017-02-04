import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form';

import auth from './reducers/auth'
import memberships from './reducers/memberships'
import players from './reducers/players'
import profile from './reducers/profile'

import { fetchUserDetailsIfNeeded } from './actions/auth'

import Base from './containers/Base'
import BaseContent from './containers/BaseContent'
import CreateTeam from './containers/CreateTeam'
import EditTeam from './containers/EditTeam'
import Index from './components/Index'
import LogIn from './containers/auth/LogIn'
import LogOut from './containers/auth/LogOut'
import MyTeams from './containers/MyTeams'
import Players from './containers/Players'
import Profile from './containers/Profile'
import Register from './containers/auth/Register'
import Teams from './containers/Teams'

import requireAuthentication from './components/auth/AuthenticatedComponent'

import indexStyles from './styles/index.sass'
import purecss from 'purecss/build/pure.css'
import puregrids from 'purecss/build/grids-responsive.css'
import 'font-awesome/css/font-awesome.css'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
const loggerMiddleware = createLogger()

let store = createStore(
    combineReducers({
        auth,
        memberships,
        players,
        profile,
        form: formReducer,
        routing: routerReducer
    }),
    compose(
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        ),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
)

store.dispatch(fetchUserDetailsIfNeeded())

// Use syncHistoryWithStore to receive dispatched navigation actions
//const history = syncHistoryWithStore(browserHistory, store)

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={Base}>
                <Route component={BaseContent}>
                    <Route path='login'     component={LogIn} />
                    <Route path='logout'    component={requireAuthentication(LogOut)} />
                    <Route path='register'  component={Register} />
                    <Route path='profile'   component={requireAuthentication(Profile)} />
                    <Route path='players'   component={Players} />
                    <Route path='teams'>
                        <IndexRoute             component={Teams} />
                        <Route path='create'    component={requireAuthentication(CreateTeam)} />
                        <Route path=':id/edit'       component={requireAuthentication(EditTeam)} />
                    </Route>
                    <Route path='my-teams'     component={requireAuthentication(MyTeams)} />
                </Route>
                <IndexRoute component={Index} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('react-root')
)
