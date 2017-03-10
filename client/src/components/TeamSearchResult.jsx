import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { withAllFixtures } from 'components/forms/TeamSearchForm'

import { Label } from 'react-bootstrap'
import { FixtureDisplay, Loading } from 'utils'
import { CaptainIcon, RegionIcon, PositionIcon, SkillBracketIcon } from 'utils/components/icons'

class TeamSearchResult extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired,
        regions: PropTypes.array
    }



    render() {
        const { id, fixtures, username, regions } = this.props
        const isLoading = Object.keys(fixtures).some(fixture => fixtures[fixture].isLoading)
        const lastUpdated = Object.keys(fixtures).every(fixture => fixtures[fixture].lastUpdated)

        console.log('PROPS: ', this.props)
        return(
            <div className='team-search-result' style={{ border: '1px solid #DDD', padding: '2rem', marginBottom: '2rem' }}>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <Link to={`teams/${id}`}>
                                    <strong>{username}</strong>
                                </Link>
                            </div>
                            <div>
                                <RegionIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={regions} fixture={fixtures.regions}/>
                            </div>
                        </div>
                    ) : <p>Error, please try again.</p>
                )}
            </div>

        )
    }

}

TeamSearchResult = withAllFixtures(TeamSearchResult)

export default TeamSearchResult