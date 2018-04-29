import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

class LastUpdated extends PureComponent {

    static propTypes = {
        lastUpdated: PropTypes.number.isRequired,
        intervalFrequency: PropTypes.number
    }

    static defaultProps = {
        intervalFrequency: 5000
    }

    constructor(props) {
        super(props)
        this.state = {
            lastUpdatedInterval: null,
            lastUpdatedString: ''
        }
        this.addNewInterval = this.addNewInterval.bind(this)
        this.updateString = this.updateString.bind(this)
    }

    addNewInterval(newLastUpdated) {
        const { lastUpdatedInterval } = this.state
        const { intervalFrequency } = this.props
        clearInterval(lastUpdatedInterval)
        const intervalId = setInterval(() => this.updateString(newLastUpdated), intervalFrequency)
        this.setState({lastUpdatedInterval: intervalId})
        this.updateString(newLastUpdated)
    }

    updateString(nextLastUpdated) {
        this.setState({
            lastUpdatedString: moment(nextLastUpdated).fromNow()
        })
    }

    componentWillMount() {
        this.addNewInterval(this.props.lastUpdated)
    }

    componentWillReceiveProps(nextProps) {
        const { lastUpdated } = this.props
        const { lastUpdated: nextLastUpdated } = nextProps
        if (lastUpdated !== nextLastUpdated) {
            this.addNewInterval(nextLastUpdated)
        }
    }

    componentWillUnmount() {
        const { lastUpdatedInterval } = this.state
        clearInterval(lastUpdatedInterval)
    }

    render() {
        const { lastUpdatedString } = this.state
        return (
            <span>{lastUpdatedString}</span>
        )
    }
}

export default LastUpdated
