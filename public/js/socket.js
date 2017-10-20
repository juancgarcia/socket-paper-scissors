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
    first_name: 'first_name',
    last_name: 'last_name',
    email: 'email'
  })
}).then(response => {
  return response.json()
}).then(body => {
  privateData.jwtToken = body.token
  // let socket = io()
  var socket = io.connect('', {
    'query': 'token=' + privateData.jwtToken
  })
  return socket
})
