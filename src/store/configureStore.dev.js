import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import reducer from './reducer'

const loggerMiddleware = createLogger()

const configureStore = initialState => (
    createStore(
        reducer,
        initialState,
        composeWithDevTools(
            applyMiddleware(
                thunkMiddleware,
                loggerMiddleware
            )
        )
    )
)

export default configureStore
