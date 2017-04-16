import React from 'react'
import { IndexRoute, Route } from 'react-router'

import Base from 'containers/Base'
import CreateTeam from 'containers/teams/CreateTeam'
import EditProfile from 'containers/EditProfile'
import EditSettings from 'containers/EditSettings'
import EditTeam from 'containers/teams/EditTeam'
import FinishSteamSignIn from 'containers/auth/FinishSteamSignIn'
import Index from 'components/Index'
import LogIn from 'components/auth/LogIn'
import LogOut from 'containers/auth/LogOut'
import ManageTeam from 'containers/teams/ManageTeam'
import ManageTeams from 'containers/teams/ManageTeams'
import PlayerProfile from 'containers/PlayerProfile'
import PlayerSearch from 'components/PlayerSearch'
import TeamProfile from 'containers/teams/TeamProfile'
import TeamSearch from 'components/TeamSearch'

import SignUp from 'components/auth/SignUp'

export default (
    <Route path=''>
        <Route path='/' component={Base}>
            <IndexRoute component={Index} />
            <Route path='login' component={LogIn}/>
            <Route path='login-required' component={props => <LogIn alertRequired={true} {...props} />}/>
            <Route path='signup' component={SignUp}/>
            <Route path='logout' component={LogOut}/>
            <Route path='settings' component={EditSettings}/>
            <Route path='profile' component={EditProfile}/>
            <Route path='players' component={PlayerSearch} />
            <Route path='players/:id' component={PlayerProfile} />
            <Route path='teams'>
                <IndexRoute component={TeamSearch} />
                <Route path='create' component={CreateTeam} />
                <Route path='edit'>
                    <Route path=':id' component={EditTeam}/>
                </Route>
                <Route path='manage'>
                    <IndexRoute component={ManageTeams} />
                    <Route path=':id' component={ManageTeam} />
                </Route>
                <Route path=':id' component={TeamProfile} />
            </Route>
            {/*<Route path='teams' component={TeamSearch} />*/}
            {/*<Route path='teams/:id' component={TeamProfile} />*/}
            {/*<Route path='my-teams' component={ManageTeams} />*/}
        </Route>
        <Route path='finish-steam/:token' component={FinishSteamSignIn} />
    </Route>
)
