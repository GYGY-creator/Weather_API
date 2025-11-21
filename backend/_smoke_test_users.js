// _smoke_test_users.js
// Demo-style smoke test: assumes server is already running at http://localhost:3000
const fetch = require('node-fetch')

function wait(ms){ return new Promise(r => setTimeout(r, ms)) }

async function run(){
  // give the server a moment to start
  await wait(500)
  const base = 'http://localhost:3001'

  console.log('POST /users')
  let res = await fetch(base + '/users', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name: 'Alice', description: 'Tester' })})
  console.log('status', res.status)
  let created = await res.json()
  console.log('created', created)

  console.log('GET /users')
  res = await fetch(base + '/users')
  console.log('status', res.status)
  console.log('body', await res.json())

  const id = created.id
  console.log('GET /users/' + id)
  res = await fetch(base + '/users/' + id)
  console.log('status', res.status)
  console.log('body', await res.json())

  console.log('PUT /users/' + id)
  res = await fetch(base + '/users/' + id, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: 'Alice', description: 'Updated tester'})})
  console.log('status', res.status)
  console.log('body', await res.json())

  console.log('DELETE /users/' + id)
  res = await fetch(base + '/users/' + id, { method: 'DELETE' })
  console.log('status', res.status)

  process.exit(0)
}

run().catch(err=>{console.error(err); process.exit(1)})
