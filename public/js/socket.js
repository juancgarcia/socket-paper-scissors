/* global io */
/* global fetch */
const privateData = {}
const socketPromise = fetch('/login', {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: 'POST',
  body: JSON.stringify({
    username: undefined,
    first_name: 'first_name',
    last_name: 'last_name',
    email: 'email'
  })
}).then(response => {
  return response.json()
}).then(body => {
  privateData.jwtToken = body.token
  privateData.jwtPayload = JSON.parse(atob(privateData.jwtToken.split('.')[1]))
  // let socket = io()
  var socket = io.connect('/players', {
    'query': 'token=' + privateData.jwtToken
  })
  return socket
})
