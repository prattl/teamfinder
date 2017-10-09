import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Button, ButtonToolbar, Col, Grid, Navbar, Nav, NavItem, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'

import { RegionIcon, MMRIcon, PositionIcon } from 'utils/components/icons'

import 'styles/redesign.css'

const steamSignInRedirectDomain = process.env.NODE_ENV === 'production' ?
    'https://dotateamfinder.com:8000' :
    'http://localhost:8000'

const Links = () => (
    <ul className='list-inline'>
        <li><Link to='/teams'><span className='hidden-sm'>Find </span>Teams</Link></li>
        <li><Link to='/players'><span className='hidden-sm'>Find </span>Players</Link></li>
        <li><Link to=''>About</Link></li>
        <li>
            <Button className='index-cta' bsStyle='success'
                    href={`${steamSignInRedirectDomain}/login/steam/?next=/social-redirect`}>
                <i className='fa fa-steam'/>&nbsp;Sign in with steam
            </Button>
        </li>
    </ul>
)

const FeaturedTeam = ({ name, mmr, region, positions, color }) => (
    <div className='featured-team' style={{ borderLeft: `4px solid ${color}` }}>
        <Row>
            <Col xs={4}>
                <img className='img-responsive' src={'https://via.placeholder.com/75x75'} />
            </Col>
            <Col xs={8}>
                <div>
                    <h5>{name}</h5>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <MMRIcon />&nbsp;{mmr}&nbsp;&nbsp;&nbsp;
                        <RegionIcon />&nbsp;{region}
                    </div>
                    <div>
                        <PositionIcon />&nbsp;{positions.join(', ')}
                    </div>
                </div>


            </Col>
        </Row>
    </div>
)

const featuredTeams = [
    { name: 'Natus Vincere', mmr: '7k', region: 'Europe', positions: [ 'Carry' ], color: '#eaff00' },
    { name: 'Alliance', mmr: '6k', region: 'Europe', positions: [ 'Carry', 'Offlane' ], color: '#147e40' },
    { name: 'Team Secret', mmr: '6k', region: 'Europe', positions: [ 'Carry' ], color: '#FFF' },
    { name: 'Cloud 9', mmr: '7k', region: 'USA', positions: [ 'All positions' ], color: '#009ee6' },
]

const DesktopIndex = () => (
    <div className='index index-splash hidden-xs'>
        <div className='navigation clearfix'>
            <Grid>
                <h3>Dota 2 Team Finder <sup><small>Beta</small></sup></h3>
                <span className='links'>
                    <Links />
                </span>
            </Grid>
        </div>
        <div className='intro-container'>
            <div className='intro'>
                <Grid>
                    <Row>
                        <Col xs={12} md={10} mdOffset={1} lg={8} lgOffset={2}>
                            <h1>Introducing the Dota 2 Team Finder</h1>
                            <p className='lead'>The Dota 2 Team Finder is the easiest way to find your next Dota team.</p>
                            <p className='lead'>
                                Find players with similar insterests and create the perfect team for
                                tournaments, battle cup, scrims, or casual games.
                            </p>
                            <ButtonToolbar>
                                <LinkContainer to='/teams'>
                                    <Button bsStyle='success' bsSize='large' className='index-cta'>Find Teams</Button>
                                </LinkContainer>
                                <LinkContainer to='/players'>
                                    <Button bsStyle='success' bsSize='large' className='index-cta'>Find Players</Button>
                                </LinkContainer>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Grid>
            </div>
        </div>
        <div className='featured-teams'>
            <Grid>
                <h4>Featured Teams</h4>
                <Row>
                    {featuredTeams.map(team => (
                        <Col md={3} sm={6} key={`featured-team-${team.name}`}>
                            <FeaturedTeam {...team} />
                        </Col>
                    ))}
                </Row>
            </Grid>
        </div>
    </div>
)

const MobileIndex = () => (
    <div className='index index-splash visible-xs'>
        <Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href='#'><strong>Dota 2 Team Finder <sup><small>Beta</small></sup></strong></a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                    <NavItem eventKey={1} href='/teams'>Find Teams</NavItem>
                    <NavItem eventKey={2} href='/players'>Find Players</NavItem>
                    <NavItem eventKey={3} href='/about'>About</NavItem>                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <div className='intro'>
            <Grid>
                <h1>Introducing the Dota 2 Team Finder</h1>
                <p className='lead'>The Dota 2 Team Finder is the easiest way to find your next Dota team.</p>
                <p className='lead' style={{ marginBottom: '4rem' }}>
                    Find players with similar insterests and create the perfect team for
                    tournaments, battle cup, scrims, or casual games.
                </p>
                <div className='text-center' style={{ marginBottom: '2rem' }}>
                    <LinkContainer to='/teams'>
                        <Button bsStyle='success' bsSize='large' className='index-cta'>Find Teams</Button>
                    </LinkContainer>
                </div>
                <div className='text-center' style={{ marginBottom: '4rem' }}>
                    <LinkContainer to='/players'>
                        <Button bsStyle='success' bsSize='large' className='index-cta'>Find Players</Button>
                    </LinkContainer>
                </div>
            </Grid>
        </div>
        <div className='featured-teams'>
            <Grid>
                <h4>Featured Teams</h4>
                <Row>
                    {featuredTeams.map(team => (
                        <Col md={3} sm={6} key={`featured-team-${team.name}`}>
                            <FeaturedTeam {...team} />
                        </Col>
                    ))}
                </Row>
            </Grid>
        </div>
    </div>
)

class IndexRedesign extends Component {
    render() {
        return (
            <div className='index-container'>
                <Helmet>
                    <meta name='robots' content='noindex' />
                </Helmet>
                <DesktopIndex />
                <MobileIndex />
            </div>
        )
    }

}

export default IndexRedesign
