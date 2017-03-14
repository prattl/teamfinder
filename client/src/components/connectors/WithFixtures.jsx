import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { requestAllFixturesIfNeeded } from 'actions/fixtures'
import { fixturesSelector, positionsSelector } from 'utils/selectors'

const withFixtures = (selector) => (WrappedComponent) => {
    class WithFixtures extends Component {

        componentDidMount() {
            this.props.onLoad()
        }

        render() {
            return <WrappedComponent {...this.props} />
        }

    }
    WithFixtures = connect(selector, { onLoad: requestAllFixturesIfNeeded })(WithFixtures)
    return WithFixtures
}

export const withAllFixtures = withFixtures(
    createStructuredSelector({
        fixtures: fixturesSelector,
    })
)

export const withPositions = withFixtures(
    createStructuredSelector({
        positions: positionsSelector,
    })
)
