// _smoke_test_cities.js
// Demo-style smoke test: assumes server is already running at http://localhost:3000
const fetch = require('node-fetch')

function wait(ms){ return new Promise(r => setTimeout(r, ms)) }

async function run(){
  // give the server a moment to start
  await wait(500)
  const base = 'http://localhost:3001'

  console.log('POST /cities')
  let res = await fetch(base + '/cities', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name: 'Metropolis', country: 'Freedonia' })})
  console.log('status', res.status)
  let created = await res.json()
  console.log('created', created)

  console.log('GET /cities')
  res = await fetch(base + '/cities')
  console.log('status', res.status)
  console.log('body', await res.json())

  const id = created.id
  console.log('GET /cities/' + id)
  res = await fetch(base + '/cities/' + id)
  console.log('status', res.status)
  console.log('body', await res.json())

  console.log('PUT /cities/' + id)
  res = await fetch(base + '/cities/' + id, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name: 'Metropolis', country: 'Utopia'})})
  console.log('status', res.status)
  console.log('body', await res.json())

  console.log('DELETE /cities/' + id)
  res = await fetch(base + '/cities/' + id, { method: 'DELETE' })
  console.log('status', res.status)

  process.exit(0)
}

run().catch(err=>{console.error(err); process.exit(1)})
