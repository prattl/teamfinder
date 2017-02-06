import React, { Component } from 'react'

import { Nav, Navbar, NavItem } from 'react-bootstrap'

class Footer extends Component {

    render() {
        return (
            <div id='footer'>
                <Navbar>
                    <Nav>
                        <NavItem eventKey={1} href='#'>Find Teams</NavItem>
                        <NavItem eventKey={2} href='#'>Find Players</NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={3} href='#'><i className='fa fa-github'/>&nbsp;View on Github</NavItem>
                    </Nav>
                </Navbar>
            </div>
        )
    }

}

export default Footer
