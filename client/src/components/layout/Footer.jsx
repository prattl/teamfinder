import React, { Component } from 'react'

import { Nav, Navbar, NavItem } from 'react-bootstrap'
// import { LinkContainer } from 'react-router-bootstrap'

class Footer extends Component {

    render() {
        return (
            <div id='footer'>
                <Navbar>
                    <Navbar.Header className='visible-xs'>
                        <Navbar.Brand>
                            <a href='https://github.com/prattl/teamfinder'>
                                <i className='fa fa-github'/>&nbsp;View on Github
                            </a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav className='hidden-xs'>
                            <NavItem eventKey={3} href='https://github.com/prattl/teamfinder'>
                                <i className='fa fa-github'/>&nbsp;View on Github
                            </NavItem>
                            <p className='navbar-text'>
                                Copyright &copy; {new Date().getFullYear()}, dotateamfinder.com. Powered
                                by <a href='http://store.steampowered.com/'>Steam <i className='fa fa-steam'/></a>
                            </p>
                        </Nav>
                    </Navbar.Collapse>

                </Navbar>
            </div>
        )
    }

}

export default Footer
