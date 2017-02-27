import React from 'react'
import { IndexRoute, Route } from 'react-router'

import Base from 'containers/Base'
import Index from 'components/Index'
import LogIn from 'components/auth/LogIn'
import LogOut from 'containers/auth/LogOut'
import PlayerSearch from 'components/PlayerSearch'
import PlayerProfile from 'containers/PlayerProfile'
import SignUp from 'components/auth/SignUp'

export default (
    <Route path='/' component={Base}>
        <IndexRoute component={Index} />
        <Route path='login' component={LogIn}/>
        <Route path='signup' component={SignUp}/>
        <Route path='logout' component={LogOut}/>
        <Route path='players' component={PlayerSearch} />
        <Route path='players/:id' component={PlayerProfile} />
    </Route>
)

/*
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
*/
