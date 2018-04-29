import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

import { Link } from 'react-router'
import { Badge, Button, ButtonToolbar, Modal, Table, Tab, Tabs } from 'react-bootstrap'

import PlayerName from 'components/players/PlayerName'
import { withPositions } from 'components/connectors/WithFixtures'
import { requestTeamInvitations,
    withdrawInvitation,
    tryWithdrawInvitation, cancelWithdrawInvitation
} from 'actions/teamEvents'
import { Loading, playerIsCaptain } from 'utils'


const InvitationTabLabel = ({ children, count }) => (
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

class ManageInvitations extends Component {

    static propTypes = {
        team: PropTypes.object.isRequired,
        player: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.handleWithdrawInvitationClick = this.handleWithdrawInvitationClick.bind(this)
        this.handleWithdrawCancelClick = this.handleWithdrawCancelClick.bind(this)
        this.handleWithdrawConfirmClick = this.handleWithdrawConfirmClick.bind(this)
    }

    componentDidMount() {
        const { requestTeamInvitations, team: { id } } = this.props
        requestTeamInvitations(id)
    }

    handleWithdrawInvitationClick(invitationId) {
        const { tryWithdrawInvitation } = this.props
        tryWithdrawInvitation(invitationId)
    }

    handleWithdrawCancelClick() {
        const { cancelWithdrawInvitation } = this.props
        cancelWithdrawInvitation()
    }

    handleWithdrawConfirmClick() {
        const { withdrawInvitation, teamEvents: { invitations: { items, confirmWithdraw } } } = this.props
        withdrawInvitation(confirmWithdraw, items[confirmWithdraw].team)
    }

    getFilteredInvitations() {
        const { team, teamEvents: { invitations: { items } } } = this.props

        return Object.keys(items).map(
            invitationId => items[invitationId]
        ).filter(invitation => invitation.team === team.id)
    }

    renderWithdrawConfirmModal() {
        const { teamEvents: { invitations: { items, confirmWithdraw } } } = this.props
        const invitation = confirmWithdraw ? items[confirmWithdraw] : null

        return (invitation &&
            <Modal show={Boolean(confirmWithdraw)}>
                <Modal.Header>
                    <Modal.Title>
                        Confirm Withdraw Invitation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to
                        withdraw <strong><PlayerName playerId={invitation.player} />'s</strong> invitation? They will
                        no longer be able to join the team with this invitation. This cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='link' onClick={this.handleWithdrawCancelClick}>Cancel</Button>
                    <Button bsStyle='danger' onClick={this.handleWithdrawConfirmClick}>Withdraw</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderInvitationTab(index, statusLabel, statusIndex) {
        let invitations = this.getFilteredInvitations()
        invitations = invitations.filter(invitation => invitation.status === statusIndex)
        return (
            <Tab eventKey={index} key={`${statusLabel}-invitations-${index}`}
                 title={<InvitationTabLabel count={invitations.length}>{statusLabel}</InvitationTabLabel>}>
                {this.renderInvitationsTable(invitations)}
            </Tab>
        )
    }

    renderInvitationsTable(invitations) {
        const { team, player, positions } = this.props
        return (
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Position invited for</th>
                            <th>Invited On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invitations.map(invitation => (
                            <tr key={invitation.id}>
                                <td>
                                    <Link to={`/players/${invitation.player}/`}>
                                        <PlayerName key={invitation.player} playerId={invitation.player} />
                                    </Link>
                                </td>
                                <td>
                                    {positions.items[invitation.position].name}
                                </td>
                                <td>
                                    {moment(invitation.created).format('L')}
                                </td>
                                <td>
                                    {invitation.status === 1 && (
                                        <ButtonToolbar>
                                            <Button bsSize='sm' bsStyle='danger'
                                                    disabled={!playerIsCaptain(player, team)}
                                                    onClick={() => this.handleWithdrawInvitationClick(invitation.id)}>
                                                Withdraw
                                            </Button>
                                        </ButtonToolbar>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {invitations.length === 0 && <div className='text-center'>No invitations</div>}
            </div>
        )
    }

    render() {
        const { teamEvents: { invitations: { isLoading, lastUpdated } } } = this.props

        return (
            <div>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            {this.renderWithdrawConfirmModal()}
                            <Tabs defaultActiveKey={1} id='invitation-tabs'>
                                {Object.keys(statusMapping).map((statusText, i) => (
                                    this.renderInvitationTab(i + 1, statusText, statusMapping[statusText])
                                ))}
                            </Tabs>
                        </div>
                    ) : <div>Error retrieving invitations.</div>
                )}
            </div>
        )
    }
}

ManageInvitations = withPositions(ManageInvitations)
ManageInvitations = connect(
    state => ({
        teamEvents: state.teamEvents
    }), {
        requestTeamInvitations,
        tryWithdrawInvitation,
        cancelWithdrawInvitation,
        withdrawInvitation
    }
)(ManageInvitations)

export default ManageInvitations
