import React, { Component } from 'react'
import { connect } from 'react-redux'
import { authSelector } from 'utils/selectors'
import { requestAuthStatusIfNeeded } from 'actions/auth'

import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'

const baseMenuLinks = [
    { route: '/teams', label: 'Find Teams' },
    { route: '/players', label: 'Find Players' }
]

const loggedInMenuLinks = [
    { route: '/profile', label: 'Edit Profile' },
    { route: '/teams/manage', label: 'My Teams' },
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
        const { authToken, tokenVerified } = this.props
        const loggedIn = authToken && tokenVerified

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
                            <LinkContainer to={menuLink.route} key={`menu-link-${i}`}>
                                <NavItem eventKey={i}>{menuLink.label}</NavItem>
                            </LinkContainer>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

TopNav = connect(
    authSelector,
    { onLoad: requestAuthStatusIfNeeded }
)(TopNav)

export default TopNav
