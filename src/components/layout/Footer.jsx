import React, { Component } from 'react'

import { Link } from 'react-router'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
// import { LinkContainer } from 'react-router-bootstrap'

class Footer extends Component {

    render() {
        return (
            <div id='footer'>
                <Navbar>
                    <Navbar.Header className='visible-xs'>
                        <Navbar.Brand>
                            <Link to='#'><i className='fa fa-github'/>&nbsp;View on Github</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        {/*<Nav>*/}
                            {/*<LinkContainer to='/teams'>*/}
                                {/*<NavItem eventKey={1}>Find Teams</NavItem>*/}
                            {/*</LinkContainer>*/}
                            {/*<LinkContainer to='/players'>*/}
                                {/*<NavItem eventKey={2}>Find Players</NavItem>*/}
                            {/*</LinkContainer>*/}
                        {/*</Nav>*/}
                        <Nav pullRight className='hidden-xs'>
                            <NavItem eventKey={3} href='#'><i className='fa fa-github'/>&nbsp;View on Github</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }

}

export default Footer
