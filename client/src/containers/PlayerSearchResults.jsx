import React, { Component, PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { submit } from 'redux-form'
import { Link } from 'react-router'
import { createStructuredSelector } from 'reselect'

import { withAllFixtures } from 'components/forms/PlayerSearchForm'
import { requestPlayerSearch, requestNextPageOfPlayers } from 'actions/playerSearch'
import { playerSearchSelector } from 'utils/selectors'

import { Button, Col, Row } from 'react-bootstrap'
import { FixtureDisplay, Loading } from 'utils'
import { RegionIcon, PositionIcon, SkillBracketIcon } from 'utils/components/icons'
import LastUpdated from 'utils/components/LastUpdated'

// TODO: Connect this component to the fixtures store (or connect each line item to its own slice of the
// TODO: fixtures store?)
class PlayerSearchResult extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired,
        regions: PropTypes.array,
        positions: PropTypes.array,
        skill_bracket: PropTypes.string
    }

    render() {
        const { id, fixtures, username, regions, positions, skill_bracket } = this.props
        const isLoading = Object.keys(fixtures).some(fixture => fixtures[fixture].isLoading)
        const lastUpdated = Object.keys(fixtures).every(fixture => fixtures[fixture].lastUpdated)
        return (
            <div className='player-search-result' style={{ border: '1px solid #DDD', padding: '2rem', marginBottom: '2rem' }}>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <Link to={`players/${id}`}>
                                    <strong>{username}</strong>
                                </Link>
                            </div>
                            <div>
                                <RegionIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={regions} fixture={fixtures.regions}/>
                            </div>
                            <div>
                                <SkillBracketIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={skill_bracket} fixture={fixtures.skillBrackets}/>
                            </div>
                            <div>
                                <PositionIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={positions} fixture={fixtures.positions}/>
                            </div>
                        </div>
                    ) : <p>Error, please try again.</p>
                )}
            </div>
        )
    }
}

PlayerSearchResult = withAllFixtures(PlayerSearchResult)

class PlayerSearchResults extends PureComponent {

    constructor(props) {
        super(props)
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }

    componentDidMount() {
        this.props.submit('playerSearch')
    }

    handleRefreshClick(e) {
        e.preventDefault()
        this.props.submit('playerSearch')
    }

    render() {
        const { requestNextPageOfPlayers,
            playerSearch: { results, count, next, nextPageLoading, isLoading, lastUpdated } } = this.props
        return (
            <div>
                <div style={{ margin: '2rem 0', visibility: lastUpdated ? 'visible' : 'hidden' }}>
                    <div className='pull-left'>
                        {count} players found
                    </div>
                    <div className='pull-right'>
                        Last updated {lastUpdated && <LastUpdated lastUpdated={lastUpdated}/>}&nbsp;
                        (<a href='' onClick={this.handleRefreshClick}>refresh</a>)
                    </div>
                    <div style={{ clear: 'both' }} />
                </div>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            <Row>
                                {results.map(result => (
                                    <Col sm={6} key={result.id}>
                                        <PlayerSearchResult {...result} />
                                    </Col>
                                ))}
                            </Row>
                            {next && (
                                <div className='text-center'>
                                    <Button bsStyle='default' disabled={nextPageLoading}
                                            onClick={() => requestNextPageOfPlayers()}>&darr;&nbsp;Next</Button>
                                    {nextPageLoading && <Loading />}
                                </div>
                            )}
                        </div>
                    ) : <p>Error, please try again.</p>
                )}
            </div>
        )
    }

}

PlayerSearchResults = connect(
    createStructuredSelector({
        playerSearch: playerSearchSelector,
    }),
    { requestPlayerSearch, requestNextPageOfPlayers, submit }
)(PlayerSearchResults)

export default PlayerSearchResults
