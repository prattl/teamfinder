import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import ReactGA from 'react-ga'

import configureStore from './store/configureStore'
import routes from './routes'

import 'styles/app.css'
import 'styles/redesign.css'

import 'styles/bootstrap/css/bootstrap.css'

import 'font-awesome/css/font-awesome.css'
import 'react-select/dist/react-select.css'
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

ReactGA.initialize('UA-97076428-1')

const logPageView = () => {
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={history} onUpdate={logPageView}>
            {routes}
        </Router>
    </Provider>,
    document.getElementById('root')
)
