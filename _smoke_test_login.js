// _smoke_test_login.js
// Tests POST /login

function wait(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run()
{
    await wait(500);

    const baseUrl = 'http://localhost:3001';

    console.log('POST /login');

    const response = await fetch(
        baseUrl + '/login',
        {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json' },
            body : JSON.stringify(
            {
                username : 'SmokeUser',
                password : 'test123'
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
