import fetch from 'isomorphic-fetch'


export default {
    get: (dispatch, getState, url, request, receive) => {
        dispatch(request())
        const authToken = getState().auth.authToken
        return fetch(url, {
                headers: {
                    'Authorization': 'Token ' + authToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        ).then(
            response => response.json().then(json => ({json, response}))
        ).then(
            ({ json, response }) => {
                if (!response.ok) {
                    return Promise.reject(json)
                }
                dispatch(receive(json))
            }
        ).catch(err => {
            dispatch(receive(err, true))
        })
    },
    get2: (url, authToken = null, extraHeaders = {}) => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...extraHeaders
        }
        if (authToken) { headers['Authorization'] = `Token ${authToken}`}
        return fetch(url, {
            headers,
            credentials: 'same-origin'
        }).then(
            response => response.json().then(json => ({json, response}))
        )
    },
    post: (dispatch, getState, url, request, receiver, {data=null, useToken=false, processResponse=true}) => {
        dispatch(request())
        const authToken = getState().auth.authToken
        const csrftoken = getCookie('csrftoken')
        const args = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        }
        if (data) { args.body = JSON.stringify(data) }
        if (useToken) { args.headers['Authorization'] = 'Token ' + authToken}

        if (!processResponse) {
            return fetch(url, args).then(response => response.json().then(json => ({json, response})))
        }

        return fetch(url, args)
        .then(
            response => response.json().then(json => ({json, response}))
        ).then( ({ json, response }) => {
            if (!response.ok) {
                dispatch(receiver(json, true))
                return ({json, response})
            }
            return dispatch(receiver(json))
        })
    },
    post2: (url, authToken, body = {}, extraHeaders = {}) => {
        const responseHandler = response => {
            console.log('post2 got response', response)
            return response.json()
        }
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...extraHeaders
        }
        if (authToken) { headers['Authorization'] = `Token ${authToken}` }
        return fetch(url, {
            headers,
            body: JSON.stringify(body),
            credentials: 'same-origin',
            method: 'POST'
        }).then(
            response => {
                return response.text().then(text => (text ? {json: JSON.parse(text), response} : {response}))
            }
        )
    },
    patch: (url, authToken, body = {}, extraHeaders = {}) => {
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
            ...extraHeaders
        }
        return fetch(url, {
            headers,
            body: JSON.stringify(body),
            credentials: 'same-origin',
            method: 'PATCH'
        }).then(
            response => response.json().then(json => ({json, response}))
        )
    },
    del: (url, authToken, extraHeaders = {}) => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...extraHeaders
        }
        if (authToken) { headers['Authorization'] = `Token ${authToken}` }
        return fetch(url, {
            headers,
            credentials: 'same-origin',
            method: 'DELETE'
        })
    }
}
