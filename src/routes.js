import React from 'react'
import { IndexRoute, Route } from 'react-router'

import Base from 'containers/Base'

export default (
    <Route path='/' component={Base}>

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
