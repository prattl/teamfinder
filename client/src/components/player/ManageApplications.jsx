import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { Link } from 'react-router'
import { Badge, Button, ButtonToolbar, Modal, Table, Tab, Tabs } from 'react-bootstrap'

import TeamName from 'components/teams/TeamName'
import { withPositions } from 'components/connectors/WithFixtures'
import { requestPlayerApplications,
    withdrawApplication,
    tryWithdrawApplication, cancelWithdrawApplication
 } from 'actions/playerEvents'
import { Loading } from 'utils'


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
        player: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.handleWithdrawApplicationClick = this.handleWithdrawApplicationClick.bind(this)
        this.handleWithdrawCancelClick = this.handleWithdrawCancelClick.bind(this)
        this.handleWithdrawConfirmClick = this.handleWithdrawConfirmClick.bind(this)
    }

    componentDidMount() {
        const { requestPlayerApplications } = this.props
        requestPlayerApplications()
    }

    handleWithdrawApplicationClick(applicationId) {
        const { tryWithdrawApplication } = this.props
        tryWithdrawApplication(applicationId)
    }

    handleWithdrawCancelClick() {
        const { cancelWithdrawApplication } = this.props
        cancelWithdrawApplication()
    }

    handleWithdrawConfirmClick() {
        const { withdrawApplication, playerEvents: { applications: { items, confirmWithdraw } } } = this.props
        withdrawApplication(confirmWithdraw, items[confirmWithdraw])
    }

    renderWithdrawConfirmModal() {
        const { playerEvents: { applications: { items, confirmWithdraw } } } = this.props
        const application = confirmWithdraw ? items[confirmWithdraw] : null

        return (application &&
            <Modal show={Boolean(confirmWithdraw)}>
                <Modal.Header>
                    <Modal.Title>
                        Confirm Withdraw Application
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to withdraw your application
                        to <strong><TeamName teamId={application.team} /></strong>? This
                        cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='link' onClick={this.handleWithdrawCancelClick}>Cancel</Button>
                    <Button bsStyle='danger' onClick={this.handleWithdrawConfirmClick}>Withdraw</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderApplicationTab(index, statusLabel, statusIndex) {
        const { playerEvents: { applications: { items } } } = this.props
        let applications = Object.keys(items).map(appId => items[appId])
        applications = applications.filter(application => application.status === statusIndex)
        return (
            <Tab eventKey={index} key={`${statusLabel}-applications-${index}`}
                 title={<ApplicationTabLabel count={applications.length}>{statusLabel}</ApplicationTabLabel>}>
                {this.renderApplicationsTable(applications)}
            </Tab>
        )
    }

    renderApplicationsTable(applications) {
        const { positions } = this.props
        return (
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th>Position applied for</th>
                            <th>Applied On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(application => (
                            <tr key={application.id}>
                                <td>
                                    <Link to={`/teams/${application.team}/`}>
                                        <TeamName key={application.team} teamId={application.team} />
                                    </Link>
                                </td>
                                <td>
                                    {positions.items[application.position] && positions.items[application.position].name}
                                </td>
                                <td>
                                    {moment(application.created).format('L')}
                                </td>
                                <td>
                                    {application.status === 1 && (
                                        <ButtonToolbar>
                                            <Button bsStyle='danger'
                                                    onClick={() => this.handleWithdrawApplicationClick(application.id)}>
                                                Withdraw
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
        const { playerEvents: { applications: { isLoading, lastUpdated } } } = this.props

        return (
            <div>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            {this.renderWithdrawConfirmModal()}
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
        playerEvents: state.playerEvents
    }), {
        requestPlayerApplications,
        withdrawApplication,
        tryWithdrawApplication,
        cancelWithdrawApplication
    }
)(ManageApplications)

export default ManageApplications
