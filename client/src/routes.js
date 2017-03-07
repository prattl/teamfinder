import React from 'react'
import { IndexRoute, Route } from 'react-router'

import Base from 'containers/Base'
import EditProfile from 'containers/EditProfile'
import Index from 'components/Index'
import LogIn from 'components/auth/LogIn'
import LogOut from 'containers/auth/LogOut'
import PlayerProfile from 'containers/PlayerProfile'
import PlayerSearch from 'components/PlayerSearch'
import TeamProfile from 'containers/TeamProfile'
import TeamSearch from 'components/TeamSearch'

import SignUp from 'components/auth/SignUp'

export default (
    <Route path='/' component={Base}>
        <IndexRoute component={Index} />
        <Route path='login' component={LogIn}/>
        <Route path='login-required' component={props => <LogIn alertRequired={true} {...props} />}/>
        <Route path='signup' component={SignUp}/>
        <Route path='logout' component={LogOut}/>
        <Route path='profile' component={EditProfile}/>
        <Route path='players' component={PlayerSearch} />
        <Route path='players/:id' component={PlayerProfile} />
        <Route path='teams' component={TeamSearch} />
        <Route path='teams/:id' component={TeamProfile} />
    </Route>
)
