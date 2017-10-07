import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { Link } from 'react-router'
import { Badge, Button, ButtonToolbar, Modal, Table, Tab, Tabs } from 'react-bootstrap'

import PlayerName from 'components/players/PlayerName'
import { withPositions } from 'components/connectors/WithFixtures'
import { requestTeamApplications, 
    acceptApplication, rejectApplication,
    tryAcceptApplication, cancelAcceptApplication,
    tryRejectApplication, cancelRejectApplication,
 } from 'actions/teamEvents'
import { Loading, playerIsCaptain } from 'utils'


const ApplicationTabLabel = ({ children, count }) => (
    <span>
        {children}
        {count > 0 && <span> <Badge>{count}</Badge></span>}
    </span>
)

const statusMapping = {
    Pending: 1,
    Accepted: 2,
    Rejected: 3,
    Expired: 4,
    Withdrawn: 5
}

class ManageApplications extends Component {

    static propTypes = {
        team: PropTypes.object.isRequired,
        player: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.handleAcceptApplicationClick = this.handleAcceptApplicationClick.bind(this)
        this.handleAcceptCancelClick = this.handleAcceptCancelClick.bind(this)
        this.handleAcceptConfirmClick = this.handleAcceptConfirmClick.bind(this)
        this.handleRejectApplicationClick = this.handleRejectApplicationClick.bind(this)
        this.handleRejectCancelClick = this.handleRejectCancelClick.bind(this)
        this.handleRejectConfirmClick = this.handleRejectConfirmClick.bind(this)
    }

    componentDidMount() {
        const { requestTeamApplications, team: { id } } = this.props
        requestTeamApplications(id)
    }

    handleAcceptApplicationClick(applicationId) {
        const { tryAcceptApplication } = this.props
        tryAcceptApplication(applicationId)
    }

    handleAcceptCancelClick() {
        const { cancelAcceptApplication } = this.props
        cancelAcceptApplication()
    }

    handleAcceptConfirmClick() {
        const { acceptApplication, teamEvents: { applications: { items, confirmAccept } } } = this.props
        acceptApplication(confirmAccept, items[confirmAccept].team)
    }

    handleRejectApplicationClick(applicationId) {
        const { tryRejectApplication } = this.props
        tryRejectApplication(applicationId)
    }
    
    handleRejectCancelClick() {
        const { cancelRejectApplication } = this.props
        cancelRejectApplication()
    }

    handleRejectConfirmClick() {
        const { rejectApplication, teamEvents: { applications: { items, confirmReject } } } = this.props
        rejectApplication(confirmReject, items[confirmReject].team)
    }

    getFilteredApplications() {
        const { team, teamEvents: { applications: { items } } } = this.props

        return Object.keys(items).map(
            applicationId => items[applicationId]
        ).filter(application => application.team === team.id)
    }

    renderAcceptConfirmModal() {
        const { teamEvents: { applications: { items, confirmAccept } } } = this.props
        const application = confirmAccept ? items[confirmAccept] : null

        return (application &&
            <Modal show={Boolean(confirmAccept)}>
                <Modal.Header>
                    <Modal.Title>
                        Confirm Accept Application
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to
                        accept <strong><PlayerName playerId={application.player} />'s</strong> application? This
                        cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='link' onClick={this.handleAcceptCancelClick}>Cancel</Button>
                    <Button bsStyle='success' onClick={this.handleAcceptConfirmClick}>Accept</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderRejectConfirmModal() {
        const { teamEvents: { applications: { items, confirmReject } } } = this.props
        const application = confirmReject ? items[confirmReject] : null

        return (application &&
            <Modal show={Boolean(confirmReject)}>
                <Modal.Header>
                    <Modal.Title>
                        Confirm Reject Application
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to
                        reject <strong><PlayerName playerId={application.player} />'s</strong> application? This
                        cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='link' onClick={this.handleRejectCancelClick}>Cancel</Button>
                    <Button bsStyle='danger' onClick={this.handleRejectConfirmClick}>Reject</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderApplicationTab(index, statusLabel, statusIndex) {
        let applications = this.getFilteredApplications()
        applications = applications.filter(application => application.status === statusIndex)
        return (
            <Tab eventKey={index} key={`${statusLabel}-applications-${index}`}
                 title={<ApplicationTabLabel count={applications.length}>{statusLabel}</ApplicationTabLabel>}>
                {this.renderApplicationsTable(applications)}
            </Tab>
        )
    }

    renderApplicationsTable(applications) {
        const { team, player, positions } = this.props
        return (
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Position applied for</th>
                            <th>Applied On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(application => (
                            <tr key={application.id}>
                                <td>
                                    <Link to={`/players/${application.player}/`}>
                                        <PlayerName key={application.player} playerId={application.player} />
                                    </Link>
                                </td>
                                <td>
                                    {positions.items[application.position].name}
                                </td>
                                <td>
                                    {moment(application.created).format('L')}
                                </td>
                                <td>
                                    {application.status === 1 && (
                                        <ButtonToolbar>
                                            <Button bsSize='sm' bsStyle='success'
                                                    disabled={!playerIsCaptain(player, team)}
                                                    onClick={() => this.handleAcceptApplicationClick(application.id)}>
                                                Accept
                                            </Button>
                                            <Button bsSize='sm' bsStyle='danger'
                                                    disabled={!playerIsCaptain(player, team)}
                                                    onClick={() => this.handleRejectApplicationClick(application.id)}>
                                                Reject
                                            </Button>
                                        </ButtonToolbar>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {applications.length === 0 && <div className='text-center'>No applications</div>}
            </div>
        )
    }

    render() {
        const { teamEvents: { applications: { isLoading, lastUpdated } } } = this.props

        return (
            <div>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            {this.renderAcceptConfirmModal()}
                            {this.renderRejectConfirmModal()}
                            <Tabs defaultActiveKey={1} id='application-tabs'>
                                {Object.keys(statusMapping).map((statusText, i) => (
                                    this.renderApplicationTab(i + 1, statusText, statusMapping[statusText])
                                ))}
                            </Tabs>
                        </div>
                    ) : <div>Error retrieving applications.</div>
                )}
            </div>
        )
    }
}

ManageApplications = withPositions(ManageApplications)
ManageApplications = connect(
    state => ({
        teamEvents: state.teamEvents
    }), {
        requestTeamApplications,
        tryAcceptApplication,
        cancelAcceptApplication,
        acceptApplication,
        tryRejectApplication,
        cancelRejectApplication,
        rejectApplication
    }
)(ManageApplications)

export default ManageApplications
