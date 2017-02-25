import React from 'react'

// TODO: This should all be organized somehow...

const isProduction = process.env.NODE_ENV === 'production'

export const createUrl = url => (
    isProduction ? `//dotateamfinder.com:8000${url}` : `//localhost:8000${url}`
)

export const metaGenerator = meta => ({receivedAt: Date.now()})

const arrayToObjectByIdentifier = identifier => list => (
    list.reduce((acc, val) => ({...acc, [val[identifier]]: val}), {})
)

export const arrayToObject = arrayToObjectByIdentifier('id')

export const Loading = () => (
    <div className='text-center'>
        <i className='fa fa-cog fa-spin fa-2x'/>&nbsp;Loading...
    </div>
)

export const FixtureDisplay = ({ value, fixture }) => (
    !fixture.isLoading && fixture.lastUpdated ? (
        <span>
            {Array.isArray(value) ? (
                value.map(fixtureId => fixture.items[fixtureId].name).join(', ')
            ) : (
                value ? fixture.items[value].name : null
            )}
        </span>
    ) : null
)

