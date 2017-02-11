import React, { Component } from 'react'

import { Link } from 'react-router'
import { Nav, Navbar, NavItem } from 'react-bootstrap'

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
                        <Nav>
                            <NavItem eventKey={1} href='#'>Find Teams</NavItem>
                            <NavItem eventKey={2} href='#'>Find Players</NavItem>
                        </Nav>
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

/*
<Grid>
    <div style={{ padding: '1rem 0' }}>
    <ButtonToolbar>
        <Button bsStyle='link' href='#'>Find Teams</Button>
        <Button bsStyle='link' href='#'>Find Players</Button>
        <Button bsStyle='link' href='#'><i className='fa fa-github'/>&nbsp;View on Github</Button>
    </ButtonToolbar>
    </div>
</Grid>
 */
