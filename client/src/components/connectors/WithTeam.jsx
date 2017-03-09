// import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import { createStructuredSelector } from 'reselect'
//
// import { requestAllFixturesIfNeeded } from 'actions/fixtures'
// import { teamsSelector } from 'utils/selectors'
//
// const withTeam = (WrappedComponent) => {
//     class WithTeam extends Component {
//
//         componentDidMount() {
//             this.props.onLoad()
//         }
//
//         render() {
//             return <WrappedComponent {...this.props} />
//         }
//
//     }
//     WithTeam = connect(teamsSelector, { onLoad: requestAllFixturesIfNeeded })(WithFixtures)
//     return WithFixtures
// }
//
// export const withAllFixtures = withFixtures(
//     createStructuredSelector({
//         fixtures: fixturesSelector,
//     }),
// )
