import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { authSelector } from 'utils/selectors'
import { withOwnPlayer } from 'components/connectors/WithOwnPlayer'
import { requestAuthStatusIfNeeded } from 'actions/auth'

import { Badge, Nav, Navbar, NavItem } from 'react-bootstrap'
import { Link } from 'react-router'
import { IndexLinkContainer } from 'react-router-bootstrap'

const baseMenuLinks = [
    { route: '/teams', label: 'Find Teams' },
    { route: '/players', label: 'Find Players' }
]

const loggedInMenuLinks = [
    { route: '/profile', label: 'Edit Profile' },
    { route: '/teams/manage', label: 'My Teams', showItems: true },
    { route: '/logout', label: 'Log Out' }
]

const loggedOutMenuLinks = [
    { route: '/login', label: 'Log In' },
    { route: '/signup', label: 'Sign Up' }
]

class TopNav extends Component {

    componentDidMount() {
        this.props.onLoad()
    }

    render() {
        const { auth: { authToken, tokenVerified }, newItems: { new_invitations, new_team_applications } } = this.props
        const loggedIn = authToken && tokenVerified
        const totalNewItems = new_invitations + new_team_applications

        const menuLinks = baseMenuLinks.concat(loggedIn ? loggedInMenuLinks : loggedOutMenuLinks)

        return (
            <Navbar staticTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to='/'>Dota 2 Team Finder <small><i>alpha</i></small></Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        {menuLinks.map((menuLink, i) => (
                            <IndexLinkContainer to={menuLink.route} key={`menu-link-${i}`}>
                                <NavItem eventKey={i}>
                                    {menuLink.label}
                                    {menuLink.showItems && totalNewItems > 0 && <span>&nbsp;<Badge>{totalNewItems}</Badge></span>}
                                </NavItem>
                            </IndexLinkContainer>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

TopNav = compose(
    withOwnPlayer,
    connect(
        state => ({ auth: authSelector(state) }),
        { onLoad: requestAuthStatusIfNeeded }
    )
)(TopNav)

export default TopNav
