// _smoke_test_alerts.js
// Demo-style smoke test for POST /send-alerts
// Assumes server is already running at http://localhost:3001

function wait(ms) 
{ 
    return new Promise(resolve => resolve(setTimeout(resolve, ms))); 
}

async function run()
{
    await wait(500);

    const baseUrl = 'http://localhost:3001';

    console.log('POST /send-alerts');

    const response = await fetch(
        baseUrl + '/send-alerts',
        { method : 'POST' }
    );

    console.log('status', response.status);
    console.log('body', await response.json());

    process.exit(0);
}

run().catch(error =>
{
    console.error(error);
    process.exit(1);
});

