import React, { Component } from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'

import Footer from 'components/Footer'

export default class Index extends Component {
    render() {
        return (
            <div className='container-fluid'>
                
                <div className='splash-container'>
                    <div className='splash'>
                        <h1 className='splash-head'>Dota 2 Team Finder</h1>
                        <div className='pure-g content-section text-center'>
                            <div className='pure-u-1 pure-u-md-1-2 pure-u-lg-1-2'>
                                <div className='index-cta'>
                                    <Link to='players'>
                                        <i className='fa fa-user fa-4x' />
                                        <h2>Find Players</h2>
                                    </Link>
                                </div>
                            </div>
                            <div className='pure-u-1 pure-u-md-1-2 pure-u-lg-1-2'>
                                <div className='index-cta'>
                                    <Link to='teams'>
                                        <i className='fa fa-users fa-4x' />
                                        <h2>Find a Team</h2>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='content-wrapper'>
                    <div className='content text-center how-it-works for-players'>
                        <h2>
                            Looking for a competitive Dota 2 team?
                        </h2>
                        <p>
                            Sign in, create a profile, and start searching for teams.
                        </p>
                        <Link to='teams' className='cta'>
                            <h3>Search for Teams</h3>
                        </Link>
                    </div>

                    <div className='content text-center how-it-works for-teams'>
                        <h2>
                            Looking for players for your team?
                        </h2>
                        <p>
                            Sign in, create a team with the positions you need to fill. Then start searching for players.
                        </p>
                        <Link to='players' className='cta'>
                            <h3>Search for Players</h3>
                        </Link>
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}
