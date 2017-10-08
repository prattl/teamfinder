import React, { Component } from 'react'

import { Nav, Navbar, NavItem } from 'react-bootstrap'
import discord from 'images/logos/discord.png'

class Footer extends Component {

    render() {
        return (
            <div id='footer'>
                <Navbar>
                    <Nav>
                        <NavItem eventKey={1} href='https://github.com/prattl/teamfinder'>
                            <i className='fa fa-github'/>&nbsp;View on Github
                        </NavItem>
                        <NavItem eventKey={2} href='https://discord.gg/gbWhPB3'>
                            Join us on <img style={{ maxHeight: '24px' }} src={discord} alt='discord'/>
                        </NavItem>
                    </Nav>

                    <p className='navbar-text'>
                        Copyright &copy; {new Date().getFullYear()}, dotateamfinder.com. Powered
                        by <a href='http://store.steampowered.com/'>Steam <i className='fa fa-steam'/></a>
                    </p>
                </Navbar>
            </div>
        )
    }

}

export default Footer
