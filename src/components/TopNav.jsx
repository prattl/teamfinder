import React, { Component } from 'react'

import { Nav, Navbar, NavItem } from 'react-bootstrap'
import { Link } from 'react-router'

const MenuLink = (props) => (
    <li className='pure-menu-item'>
        <Link to={props.to} className='pure-menu-link' activeClassName='pure-menu-selected'>
            {props.children}
        </Link>
    </li>
)

const menuLinks = {
    '/teams': 'Find Teams',
    '/players': 'Find Players'
}

const loggedInMenuLinks = {
    '/my-teams': 'My Teams',
    '/profile': 'Profile',
    '/logout': 'Log Out'
}

const loggedOutMenuLinks = {
    '/login': 'Log In'
}

export default class TopNav extends Component {

    render() {
        const { loggedIn, pathname } = this.props
        //home-link pure-menu-selected
        const menuItems = Object.keys(menuLinks).map(key => (
            <MenuLink to={key} key={key}>{menuLinks[key]}</MenuLink>
        ))
        if (loggedIn) {
            Object.keys(loggedInMenuLinks).forEach(key => {
                menuItems.push(<MenuLink to={key} key={key}>{loggedInMenuLinks[key]}</MenuLink>)
            })
        } else {
            Object.keys(loggedOutMenuLinks).forEach(key => {
                menuItems.push(<MenuLink to={key} key={key}>{loggedOutMenuLinks[key]}</MenuLink>)
            })
        }

        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to='/'>Dota 2 Team Finder</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem eventKey={1} href='#'>Find Teams</NavItem>
                        <NavItem eventKey={2} href='#'>Find Players</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            // <div className='home-menu pure-menu pure-menu-horizontal pure-menu-fixed'>
            //     <Link to='/' className='pure-menu-heading pure-menu-link' style={{float: 'left'}}>
            //         Dota 2 Team Finder
            //     </Link>
            //     <ul className='pure-menu-list'>
            //         {menuItems}
            //     </ul>
            //     <div style={{clear: 'both'}}></div>
            // </div>
        )
    }
}
