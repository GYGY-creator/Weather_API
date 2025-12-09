// _smoke_test_register.js
// Demo-style smoke test for POST /register
// Assumes server is already running at http://localhost:3001

function wait(ms) 
{ 
    return new Promise(resolve => setTimeout(resolve, ms)); 
}

async function run()
{
    await wait(500);

    const baseUrl = 'http://localhost:3001';

    console.log('POST /register');

    const response = await fetch(
        baseUrl + '/register',
        { 
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(
            {
                username : 'SmokeUser',
                password : 'test123',        // ⭐ REQUIRED
                email    : 'smoke@example.com',
                phone    : '12345',
                address  : 'Seattle'
            })
        }
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

