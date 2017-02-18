import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

const isProduction = process.env.NODE_ENV === 'production'

const middleware = isProduction ? [
    thunkMiddleware
] : [
    thunkMiddleware,
    createLogger()
]

export default middleware
