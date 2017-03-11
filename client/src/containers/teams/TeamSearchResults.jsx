import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { submit } from 'redux-form'
import { createStructuredSelector } from 'reselect'

import { requestTeamSearch, requestNextPageOfTeams } from 'actions/teamSearch'
import { teamSearchSelector } from 'utils/selectors'

import { Button, Col, Row } from 'react-bootstrap'
import { Loading } from 'utils'
import LastUpdated from 'utils/components/LastUpdated'
import TeamSearchResult from 'components/TeamSearchResult'


class TeamSearchResults extends PureComponent {

    constructor(props) {
        super(props)
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
        console.log('PROPS: ', this.props)
    }

    componentDidMount() {
        this.props.submit('teamSearch')
    }

    handleRefreshClick(e) {
        e.preventDefault()
        this.props.submit('teamSearch')
    }

    render() {
        const a = this.props
        console.log('PROPS: ', a)
        const { requestNextPageOfTeams,
            teamSearch: { results, count, next, nextPageLoading, isLoading, lastUpdated } } = this.props
        return (
            <div>
                <div style={{ margin: '2rem 0', visibility: lastUpdated ? 'visible' : 'hidden' }}>
                    <div className='pull-left'>
                        {count} teams found
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
                                        <TeamSearchResult {...result} />
                                    </Col>
                                ))}
                            </Row>
                            {next && (
                                <div className='text-center'>
                                    <Button bsStyle='default' disabled={nextPageLoading}
                                            onClick={() => requestNextPageOfTeams()}>&darr;&nbsp;Next</Button>
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

TeamSearchResults = connect(
    createStructuredSelector({
        teamSearch: teamSearchSelector,
    }),
    { requestTeamSearch, requestNextPageOfTeams, submit }
)(TeamSearchResults)

export default TeamSearchResults
