export const createUrl = url => `//localhost:8000${url}`

export const metaGenerator = meta => ({receivedAt: Date.now()})

const arrayToObjectByIdentifier = identifier => list => (
    list.reduce((acc, val) => ({...acc, [val[identifier]]: val}), {})
)

export const arrayToObject = arrayToObjectByIdentifier('id')
