import React from 'react'

const isProduction = process.env.NODE_ENV === 'production'

export const createUrl = isProduction ? (
    url => `//dotateamfinder.com:8000${url}`
) : (
    url => `//localhost:8000${url}`
)

export const metaGenerator = meta => ({receivedAt: Date.now()})

const arrayToObjectByIdentifier = identifier => list => (
    list.reduce((acc, val) => ({...acc, [val[identifier]]: val}), {})
)

export const arrayToObject = arrayToObjectByIdentifier('id')

export const Loading = () => <div className='text-center'>
    <i className='fa fa-cog fa-spin fa-2x'/>&nbsp;Loading...
</div>
