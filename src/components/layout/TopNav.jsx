import React, { Component } from 'react'

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
// const loggedInMenuLinks = {
//     '/my-teams': 'My Teams',
//     '/profile': 'Profile',
//     '/logout': 'Log Out'
// }
//
// const loggedOutMenuLinks = {
//     '/login': 'Log In'
// }

class TopNav extends Component {

    render() {
        {/*const { loggedIn, pathname } = this.props*/}

        {/*const menuItems = Object.keys(menuLinks).map(key => (*/}
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
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default TopNav
