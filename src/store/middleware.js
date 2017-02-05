import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

const isProduction = process.env.NODE_ENV === 'production'
console.log('isProduction', isProduction)

const middleware = isProduction ? [] : [
    createLogger(),
    thunkMiddleware
]

export default middleware
