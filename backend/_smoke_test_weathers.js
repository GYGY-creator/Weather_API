// _smoke_test_weathers.js
// Demo-style smoke test: assumes server is already running at http://localhost:3000
const fetch = require('node-fetch')

function wait(ms){ return new Promise(r => setTimeout(r, ms)) }

async function run(){
  // give the server a moment to start
  await wait(500)
  const base = 'http://localhost:3001'

  console.log('POST /weather')
  let res = await fetch(base + '/weather', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name: 'TestWeather', description: 'desc' })})
  console.log('status', res.status)
  let created = await res.json()
  console.log('created', created)

  console.log('GET /weather')
  res = await fetch(base + '/weather')
  console.log('status', res.status)
  console.log('body', await res.json())

  const id = created.id
  console.log('GET /weather/' + id)
  res = await fetch(base + '/weather/' + id)
  console.log('status', res.status)
  console.log('body', await res.json())

  console.log('PUT /weather/' + id)
  res = await fetch(base + '/weather/' + id, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ description: 'updated desc'})})
  console.log('status', res.status)
  console.log('body', await res.json())

  console.log('DELETE /weather/' + id)
  res = await fetch(base + '/weather/' + id, { method: 'DELETE' })
  console.log('status', res.status)

  process.exit(0)
}

run().catch(err=>{console.error(err); process.exit(1)})
