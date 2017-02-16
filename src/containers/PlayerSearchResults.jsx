import React, { Component, PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { submit } from 'redux-form'
import { createStructuredSelector } from 'reselect'

import { requestPlayerSearch, requestNextPageOfPlayers } from 'actions/playerSearch'
import { fixturesSelector, playerSearchSelector } from 'utils/selectors'

import { Button, Col, Row } from 'react-bootstrap'
import { Loading } from 'utils'
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
        const { fixtures, username, regions, positions, skill_bracket } = this.props
        const isLoading = Object.keys(fixtures).some(fixture => fixtures[fixture].isLoading)
        const lastUpdated = Object.keys(fixtures).every(fixture => fixtures[fixture].lastUpdated)
        return (
            <div className='player-search-result' style={{ border: '1px solid #DDD', padding: '2rem', marginBottom: '2rem' }}>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>{username}</strong>
                            </div>
                            <div>
                                <i className='fa fa-map-marker fa-fw'/>&nbsp;
                                {regions.map(regionId => fixtures.regions.items[regionId].name).join(', ')}
                            </div>
                            <div>
                                <i className='fa fa-line-chart fa-fw'/>&nbsp;
                                {skill_bracket && fixtures.skillBrackets.items[skill_bracket].name}
                            </div>
                            <div>
                                <i className='fa fa-briefcase fa-fw'/>&nbsp;
                                {positions.map(positionId => fixtures.positions.items[positionId].name).join(', ')}
                            </div>
                        </div>
                    ) : <p>Error, please try again.</p>
                )}
            </div>
        )
    }
}

PlayerSearchResult = connect(
    createStructuredSelector({
        fixtures: fixturesSelector
    }),
)(PlayerSearchResult)


class PlayerSearchResults extends PureComponent {

    constructor(props) {
        super(props)
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }

    componentDidMount() {
        this.props.requestPlayerSearch()
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
