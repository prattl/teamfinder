import React from 'react'

const Icon = ({ iconClassName, fixedWidth=false }) => (
    <i className={`fa ${iconClassName}${fixedWidth ? ' fa-fw' : ''}`}/>
)

export const RegionIcon = props => <Icon iconClassName='fa-map-marker' {...props} />
export const SkillBracketIcon = props => <Icon iconClassName='fa-line-chart' {...props} />
export const PositionIcon = props => <Icon iconClassName='fa-briefcase' {...props} />
export const CaptainIcon = props => <Icon iconClassName='fa-star' {...props} />
