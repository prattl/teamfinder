import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { submit } from 'redux-form'
import { createStructuredSelector } from 'reselect'

import { requestPlayerSearch, requestNextPageOfPlayers } from 'actions/playerSearch'
import { playerSearchSelector } from 'utils/selectors'
import { withPlayer } from 'components/connectors/WithPlayer'

import { Button, Col, Row } from 'react-bootstrap'
import { Loading } from 'utils'
import LastUpdated from 'utils/components/LastUpdated'
import PlayerSearchResult from 'components/PlayerSearchResult'


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
            playerSearch: { results, count, next, nextPageLoading, isLoading, lastUpdated }, player } = this.props
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
                                        <PlayerSearchResult {...result} player={player} />
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

PlayerSearchResults = withPlayer(PlayerSearchResults)

PlayerSearchResults = connect(
    createStructuredSelector({
        playerSearch: playerSearchSelector,
    }),
    { requestPlayerSearch, requestNextPageOfPlayers, submit }
)(PlayerSearchResults)

export default PlayerSearchResults
