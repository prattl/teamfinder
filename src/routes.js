import React from 'react'
import { IndexRoute, Route } from 'react-router'

import App from './App'

export default (
    <Route path='/'>
        <IndexRoute component={App}/>
    </Route>
)
