import React from 'react'

const Icon = ({ iconClassName, fixedWidth=false }) => (
    <i className={`fa ${iconClassName}${fixedWidth ? ' fa-fw' : ''}`}/>
)

export const InterestIcon = props => <Icon iconClassName='fa-thumbs-up' {...props} />
export const RegionIcon = props => <Icon iconClassName='fa-map-marker' {...props} />
export const MMRIcon = props => <Icon iconClassName='fa-line-chart' {...props} />
export const PositionIcon = props => <Icon iconClassName='fa-briefcase' {...props} />
export const CaptainIcon = props => <Icon iconClassName='fa-star' {...props} />
export const PlayerIcon = props => <Icon iconClassName='fa-user' {...props} />
export const PlayersIcon = props => <Icon iconClassName='fa-users' {...props} />
