import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { createStructuredSelector } from 'reselect'

import { Col, Row } from 'react-bootstrap'
import { Loading } from 'utils'
import { fixturesSelector, playerSearchSelector } from 'utils/selectors'

const PlayerSearchResult = ({ player, fixtures }) => (
    <Col sm={6}>
        <div className='player-search-result' style={{ border: '1px solid #DDD', padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <strong>{player.username}</strong>
            </div>
            <div>
                <i className='fa fa-map-marker fa-fw'/>&nbsp;
                {player.regions.map(regionId => fixtures.regions.items[regionId].name).join(', ')}
            </div>
            <div>
                <i className='fa fa-line-chart fa-fw'/>&nbsp;
                {fixtures.skillBrackets.items[player.skill_bracket].name}
            </div>
            <div>
                <i className='fa fa-briefcase fa-fw'/>&nbsp;
                {player.positions.map(positionId => fixtures.positions.items[positionId].name).join(', ')}
            </div>
        </div>
    </Col>
)

class PlayerSearchResults extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            lastUpdatedInterval: null,
            lastUpdatedString: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        // TODO: Encapsulate updating date string into its own component
        const { playerSearch: { lastUpdated } } = this.props
        const { playerSearch: { lastUpdated: nextLastUpdated } } = nextProps
        const { lastUpdatedInterval } = this.state
        if (lastUpdated != nextLastUpdated) {
            clearInterval(lastUpdatedInterval)
            const intervalId = setInterval(() => this.setState({
                lastUpdatedString: moment(nextLastUpdated).fromNow()
            }), 4000)
            this.setState({lastUpdatedInterval: intervalId})
        }
    }

    componentWillUnmount() {
        const { lastUpdatedInterval } = this.state
        clearInterval(lastUpdatedInterval)
    }

    render() {
        console.log('PlayerSearchResults', this.props)
        const { fixtures, playerSearch: { results, count, next, isLoading, lastUpdated } } = this.props
        return (
            <div>
                <div style={{ margin: '2rem 0', visibility: lastUpdated ? 'visible' : 'hidden' }}>
                    <div className='pull-left'>
                        {count} players found
                    </div>
                    <div className='pull-right'>
                        Last updated {moment(lastUpdated).fromNow()}
                    </div>
                    <div style={{ clear: 'both' }} />
                </div>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <Row>
                            {results.map(result => (
                                <PlayerSearchResult key={result.id} player={result} fixtures={fixtures} />
                            ))}
                        </Row>
                    ) : (null)
                )}
            </div>
        )
    }

}

PlayerSearchResults = connect(
    createStructuredSelector({
        fixtures: fixturesSelector,
        playerSearch: playerSearchSelector,
    }),
    null
)(PlayerSearchResults)

export default PlayerSearchResults
