import React, { Component } from 'react'
import { connect } from 'react-redux'
import { authSelector } from 'utils/selectors'
import { requestAuthStatus } from 'actions/auth'

import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'

// const MenuLink = (props) => (
//     <li className='pure-menu-item'>
//         <Link to={props.to} className='pure-menu-link' activeClassName='pure-menu-selected'>
//             {props.children}
//         </Link>
//     </li>
// )
//
// const menuLinks = {
//     '/teams': 'Find Teams',
//     '/players': 'Find Players'
// }
//
const loggedInMenuLinks = [
    { route: '/logout', label: 'Log Out' }
]

const loggedOutMenuLinks = [
    { route: '/login', label: 'Log In' }
]

class TopNav extends Component {

    componentDidMount() {
        this.props.onLoad()
    }

    render() {
        const { authToken, tokenVerified } = this.props
        const loggedIn = authToken && tokenVerified

        const menuLinks = loggedIn ? loggedInMenuLinks : loggedOutMenuLinks
        //
        // {/*const menuItems = Object.keys(menuLinks).map(key => (*/}
        //     <MenuLink to={key} key={key}>{menuLinks[key]}</MenuLink>
        // ))
        // if (loggedIn) {
        //     Object.keys(loggedInMenuLinks).forEach(key => {
        //         menuItems.push(<MenuLink to={key} key={key}>{loggedInMenuLinks[key]}</MenuLink>)
        //     })
        // } else {
        //     Object.keys(loggedOutMenuLinks).forEach(key => {
        //         menuItems.push(<MenuLink to={key} key={key}>{loggedOutMenuLinks[key]}</MenuLink>)
        //     })
        // }

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
                        <LinkContainer to='/teams'>
                            <NavItem eventKey={1}>Find Teams</NavItem>
                        </LinkContainer>
                        <LinkContainer to='/players'>
                            <NavItem eventKey={2}>Find Players</NavItem>
                        </LinkContainer>
                        {menuLinks.map((menuLink, i) => (
                            <LinkContainer to={menuLink.route} key={`menu-link-${i}`}>
                                <NavItem eventKey={i + 2}>{menuLink.label}</NavItem>
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
    { onLoad: requestAuthStatus }
)(TopNav)

export default TopNav
