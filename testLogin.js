const fetch = require('node-fetch');

async function login() {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'testadmin@example.com',
      password: 'Test1234'
    })
  });

  const data = await response.json();
  console.log('Response:', data);
}

login().catch(console.error);
